const fs = require("fs")

let index = fs.readFileSync("./index.html", "utf-8")
// TODO: Automate this process
index = index
    .replace('<link rel="stylesheet" href="style.css">', "<style>"+fs.readFileSync("./style.css", "utf-8")+"</style>")
    .replace('<script src="/script.js"></script>', "<script>"+fs.readFileSync("./script.js", "utf-8")+"</script>");



fs.writeFileSync("./packed.html", index, "utf-8")