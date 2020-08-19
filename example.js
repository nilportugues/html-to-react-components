const extractReactComponents = require("./lib");

const opts = {
    componentType: "stateless",
    moduleType: false
  }

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>

<div>
<label for="price" class="block text-sm leading-5 font-medium text-gray-700">Price</label>
<div class="mt-1 relative rounded-md shadow-sm">
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <span class="text-gray-500 sm:text-sm sm:leading-5">
      $
    </span>
  </div>
  <input id="price" class="form-input block w-full pl-7 pr-12 sm:text-sm sm:leading-5" placeholder="0.00">  
  <div class="absolute inset-y-0 right-0 flex items-center">
    <select aria-label="Currency" class="form-select h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm sm:leading-5">
      <option>USD</option>
      <option>CAD</option>
      <option>EUR</option>
    </select>
  </div>
</div>
</div>

</body>
</html>
`

const result = extractReactComponents(html, opts)

console.log(result)