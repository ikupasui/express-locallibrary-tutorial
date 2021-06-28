var mongoose = require('mongoose');
const { DateTime } = require("luxon");
var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get(function () {
if(this.date_of_birth && this.date_of_death){
return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)+'-'+ DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
}else if(this.date_of_birth){
return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)+'-';
}else{return 'no info';}
//return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)+'-'+ DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : 'no info';
//return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : '';
});

//Virtual for authors's birth
AuthorSchema
.virtual('birth')
.get(function () {
//return DateTime.fromJSDate(this.date_of_birth).toFormat('yyyy-MM-dd');
return DateTime.fromJSDate(this.date_of_birth).toISODate(); //上より、toISODateがBEST
});

//Virtual for authors's death
AuthorSchema
.virtual('death')
.get(function () {
return DateTime.fromJSDate(this.date_of_death).toISODate();
});


// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);
