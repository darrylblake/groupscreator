var Cohort = function(number) {
  this.number = number
  this.members = []; // Store in a list for easy iteration
  this.membersHash = {}; // Store in hash as well for quick retrieval
}

Cohort.prototype.addMember = function(name) {
  var newMember = new Person(this, name)
  this.members.push(newMember);
  // this.membersHash[name] = newMember;
  this.count = this.count + 1;
  return newMember;
}

Cohort.prototype.countVotes = function() {
  // Counting votes, assigning results to each member
  this.members.forEach(function(member) {
    member.yes.forEach(function(person) { 
      person.votesYes = person.votesYes + 1; 
    });
    member.noTech.forEach(function(noTechMember) { 
      noTechMember.votesNoTech = noTechMember.votesNoTech + 1; 
    });
    member.noPers.forEach(function(noPersMember) { 
      noPersMember.votesNoPers = noPersMember.votesNoPers + 1; 
    });
  });
  // Calculate popularity
  var that = this;
  this.members.forEach(function(member) {
    member.popularity = ((member.votesYes - member.votesNoTech - member.votesNoPers) / that.members.length) * 100
  });
}

Cohort.prototype.randomMember = function() {
  return this.members[(random(this.members.length))];
}

Cohort.prototype.randomMemberNot = function(member) {
  var selected = this.members[(random(this.members.length))];
  if (selected === member) {
    return this.randomMemberNot(member);
  }
  return selected
}

Cohort.prototype.popularityList = function() {
  // Returns a list of members ascending in popularity
  return this.members.sort(function(a, b) {
    return b.popularity - a.popularity;
  });
}

var Person = function(cohort, name) {
  this.cohort = cohort;
  this.name = name;
  this.yes = [];
  this.noTech  = []
  this.noPers = []

  this.votesYes = 0;
  this.votesNoTech = 0;
  this.votesNoPers = 0;
}

Person.prototype.twoWayMatchList = function() {
  var that = this;
  return this.yes.filter(function(member) {
    return member.yes.indexOf(that) !== -1;
  });
}

Person.prototype.twoWayMatch = function(member) {
  return this.yes.indexOf(member) !== -1 && member.yes.indexOf(this) !== -1;
}

// Randomize Helper
var random = function(maxlength) {
  return Math.floor(Math.random() * maxlength);
}

// Generating random data
var generateData  = function(cohort, names) {
  // Create members from names list
  names.forEach(function(name) {
    cohort.addMember(name);
  });
  // Add random votes
  cohort.members.forEach(function(member) {
    for (var i = 0; i < random(25); i++) {
      member.yes.push(cohort.randomMemberNot(member));
    };
    for (var i = 0; i < random(2); i++) {
      member.noTech.push(cohort.randomMemberNot(member)); 
    };
    for (var i = 0; i < random(2); i++) {
      member.noPers.push(cohort.randomMemberNot(member)); 
    };
  });
  cohort.countVotes();
}

var cohort31 = new Cohort(31);
// 40 names, South African names if you wondering...
var names = ['jabulani', 'themba', 'malusi', 'buzwe', 'lundi', 'thembi', 'thando', 'mbeki', 'zuma', 
             'nkosinati', 'thandeka', 'nomfundo', 'jabula', 'sipho', 'siphiwe', 'umfundo', 'princess',
             'philisiwe', 'thombazani', 'thembiso', 'joy', 'nonthando', 'mavis', 'jabo', 'nolwazi',
             'bongani', 'lwazi', 'lindiwe', 'mandla', 'nathi', 'nomzano', 'ntombi', 'sakhile', 'sibongile',
             'sindi', 'silindile', 'siyando', 'sizwe', 'thalente', 'thulani'];

generateData(cohort31, names);

console.log(
  cohort31.popularityList().map(function(member) {
    return [member.name, member.popularity]
  })
);
