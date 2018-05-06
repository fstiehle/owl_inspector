import Constraint from "./model/Constraint"
import Label from "./model/Label"

export default class Parser {
  constructor(Json) {
    this.map = {}
    this.setUp(Json)
    this.parseJson(Json)
  }

  setUp(Json) {
    if (!Json[0]["names"]) {
      throw new SyntaxError("JSON format error")
    }
    for (const key in Json[0]["names"]) {
      if (Json[0]["names"].hasOwnProperty(key)) {
        const element = Json[0]["names"][key];
        this.map[element] = []
      }
    }
  }

  parseJson(Json) {
    for (const key in Json) {
      if (Json.hasOwnProperty(key)) {
        const element = Json[key]
        if (!element["names"] || !element["values"] || !element["domains"]) {
          throw new SyntaxError("JSON format error")
        }        
        if (element["id"]) {
          this.parseConstraint(element)
        }
        else {
          this.parseLabeling(element)
        }        
      }
    }
  }

  parseConstraint(object) {
    for (let i = 0; i < object["names"].length; ++i) {
      this.map[object["names"][i]]
        .push(new Constraint(
          object["id"],
          object["names"][i],
          object["values"][i],
          object["domains"][i]))
    }
  }

  parseLabeling(object) {
    for (let i = 0; i < object["names"].length; ++i) {
      this.map[object["names"][i]]
        .push(new Label(
          object["names"][i],
          object["values"][i],
          object["domains"][i]))
    }
  }

}