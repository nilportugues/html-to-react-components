var generate = require("babel-generator").default

function toCode(components, styled) {
  return Object.keys(components).reduce(function(cs, name) {
    const generatedCode = generate(components[name].body).code;


    cs[name] = `
import tw from "twin.macro";
${styled[name]}

${generatedCode.replace('import React from "react";', '')}
`

    return cs
  }, {})
}

module.exports = toCode
