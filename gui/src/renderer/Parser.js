import Tracepoint from "./model/Tracepoint"

export default class Parser {
  constructor(Json) {
    this.json = Json
    this.map = []
    this.comparisons = []
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

      if (!element["names"]) {
        throw new SyntaxError("JSON format error")
      }     

      if (!element["values"] || !element["domains"] 
        || !element["domainSizes"]) {
        throw new SyntaxError("JSON format error")
      }

      this.parseTracepoint(element, i)            
    }
  }

  parseTracepoint(object, timeStamp) {
    this.map[timeStamp] = []
    for (let i = 0; i < object["names"].length; ++i) {
      this.map[timeStamp]
        .push(new Tracepoint(
          object["id"],
          object["names"][i],
          object["values"][i],
          object["domains"][i],
          object["domainSizes"][i]))
    }
  }

}