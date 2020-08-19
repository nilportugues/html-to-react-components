var api = require("posthtml/lib/api");
var render = require("posthtml-render");
var toJsxAST = require("./jsx");
var toReactComponents = require("./component");
var toModules = require("./module");
var toCode = require("./code");
var formatCode = require("./format");

function getComponentName(node) {
  return node.attrs["data-component"];
}

function removeComponentName(node) {
  delete node.attrs["data-component"];

  return node;
}

function isComponent(node) {
  var annotated = node.attrs && getComponentName(node);

  if (annotated !== undefined) {
    if (getComponentName(node).length > 0) {
      return true;
    } else {
      throw Error("There's annotated component without a name!");
    }
  }

  return false;
}

function collectComponents(components) {
  return function(node) {
    if (isComponent(node)) {
      components.push(node);
    }

    return node;
  };
}

let i = 1;
let cache = {}
function markComponents() {
  return function(node) {
    
    if (node.attrs && node.attrs["class"]) {
      const classString = node.attrs["class"];
      let name = '';

      if (cache[classString]) {
        name = cache[classString]
      } else {
        cache[classString] = `Component${i}`
        name = cache[classString];
        i++;
      }

      node.attrs["data-component"] = name     
    }

    return node;
  };
}

function clearAndRenderComponents(component) {
  component[1] = render(removeComponentName(component[1]));

  return component;
}

function assignByName(component) {
  return [getComponentName(component), component];
}

function mergeByName(components) {
  return components.reduce(function(cs, component) {
    cs[component[0]] = component[1];
    return cs;
  }, {});
}

function mergeByInstance(components) {
  return components.reduce(function(cs, component) {
    cs[component[0]] = cs[component[0]] || [];
    cs[component[0]].push(component[1]);
    return cs;
  }, {});
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function htmlToReactComponentsLib(tree, options) {
  var componentType = "stateless";
  var moduleType = "es6";

  var components = [];
  var delimiter = options.moduleFileNameDelimiter || "";

  //mark components with class and assign them a data-component name
  api.walk.bind(tree)(markComponents());

  //now collect them
  api.walk.bind(tree)(collectComponents(components));
  
  //Build the tailwind styled component
  const styled = {};
  components.forEach((component, i) => {
    const tagName = capitalizeFirstLetter(component.tag)    
    const name = component.attrs['data-component']
    
    components[i].tag = tagName;
    styled[name]="const "+tagName+" = tw.div`"+component.attrs.class+"`";    
   
  })

  //Build the react component
  var reactComponents = toReactComponents(
    componentType,
    toJsxAST(
      mergeByInstance(
        components.map(assignByName).map(clearAndRenderComponents)
      )
    )
  );


  if (moduleType) {
    return formatCode(
      toCode(toModules(moduleType, delimiter, reactComponents), styled)
    );
  }

  return formatCode(toCode(reactComponents, styled));
}

module.exports = htmlToReactComponentsLib;
