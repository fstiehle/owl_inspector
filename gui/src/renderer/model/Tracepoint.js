export default class Label {
  constructor(id, name, value, domain, domainSize, possibleValues) {
    this.id = id
    this.name = name
    this.value = value
    this.domain = domain
    this.domainSize = domainSize
    this.possibleValues = possibleValues
  }
}