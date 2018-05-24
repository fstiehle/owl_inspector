import Label from './Label.js'

export default class Constraint extends Label {
  constructor(id, name, value, domain, domainSize, possibleValues) {
    super(name, value, domain, domainSize, possibleValues)
    this.id = id
  }
}