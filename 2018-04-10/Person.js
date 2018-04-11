
function Person(Fornavn, Etternavn, Alder) {
    this.Fornavn = Fornavn;
    this.Etternavn = Etternavn;
    this.Alder = Alder;
}

Person.prototype.Fullnavn = function() 
{
    return this.Fornavn + ' ' + this.Etternavn;
}

Person.prototype.IncreaseAge = function() {
    this.Alder = this.Alder + 1;
}