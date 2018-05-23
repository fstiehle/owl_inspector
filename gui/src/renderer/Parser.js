import Constraint from "./model/Constraint"
import Label from "./model/Label"

export default class Parser {
  constructor(Json) {
    this.json = Json
    this.map = []
    this.vars = []
    this.parseNames(Json[0])
    this.parseData(Json.slice(1))
  }

  /**
   * { names: [] }
   */
  parseNames(Json) {
    if (Json["names"] && Json["names"].length > 0) {
      this.vars = Json["names"]
    } 
    else {
      throw new SyntaxError("JSON format error: Variable names need to be announced")
    }
  }

  parseData(Json) {
    let timeStamps = Object.keys(Json).length;
    if (timeStamps <= 0) {
      throw new SyntaxError("JSON has no entries")
    }
    for (let i = 0; i < timeStamps; ++i) {
      let element = Json[i]
      if (!element["names"] || !element["values"] 
      || !element["domains"] || !element["domainSizes"]) {
        throw new SyntaxError("JSON format error")
      }   
      if (element["id"]) {
        this.parseConstraint(element, i)
      }
      else {
        this.parseLabeling(element, i)
      }        
    }
  }

  parseConstraint(object, timeStamp) {
    this.map[timeStamp] = []
    for (let i = 0; i < object["names"].length; ++i) {
      this.map[timeStamp]
        .push(new Constraint(
          object["id"],
          object["names"][i],
          object["values"][i],
          object["domains"][i],
          object["domainSizes"][i]))
    }
  }

  parseLabeling(object, timeStamp) {
    this.map[timeStamp] = []
    for (let i = 0; i < object["names"].length; ++i) {
      this.map[timeStamp]
        .push(new Label(
          object["names"][i],
          object["values"][i],
          object["domains"][i],
          object["domainSizes"][i]))
    }
  }

}