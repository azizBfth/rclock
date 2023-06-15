const mongoose = require('mongoose')

const accidentSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a  name"]
        },
        message: {
            type: String,
            required: [true, "Please enter a  Message"]
        },
        lang: {
            type: String,
            required: [true, "Please enter a message lang"]
        },
        nbr_jours_sans_accident: {
            type: Number,
            required: true,
           
        },
        nbr_totale_accidents: {
            type: Number,
            required: true,
        },
        temperature: {
            type: Number,
            default: 18
          }
    },
    {
        timestamps: true
    }
)


const Accident = mongoose.model('Accident', accidentSchema);
Accident.findOne({ name: 'gct' }, function(err, acc) {
    if (err) throw err;
  
    if (!acc) {
      var newAccident = new Accident({
        name: 'gct',
        message: 'GCT ACCIDENTS MESSAGE CHECK ...',
        nbr_jours_sans_accident: 20,
        nbr_totale_accidents: 21,
        lang: 'Fr'
      });
  
      newAccident.save(function(err) {
        if (err) throw err;
        console.log('Default user created!');
      });
    }
  });
module.exports = Accident;