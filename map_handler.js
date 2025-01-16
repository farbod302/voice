const fs = require("fs")
const map_handler = {
    path: `${__dirname}/map.json`,
    get_map() {
        const file = fs.readFileSync(this.path)
        const json_string = file.toString()
        const json = JSON.parse(json_string)
        return json
    },
    add_to_map(data) {
        const cur_file = this.get_map()
        cur_file.push(data)
        const json_string = JSON.stringify(cur_file)
        fs.writeFileSync(this.path, json_string)
    },
    remove_from_map(id) {
        const cur_file = this.get_map()
        const new_file = cur_file.filter(e => e.id !== id)
        const json_string = JSON.stringify(new_file)
        fs.writeFileSync(this.path, json_string)
    }

}

module.exports = map_handler