'use strict'

var models = require('../models');
var Manager = models.Manager;
var City = models.City;

module.exports = {
    getAll : function (req, res) {
        City.find().sort('name').then( cities => {
            Manager.find().sort('name').populate('city').then( ms => {
                console.log(ms);
                res.render('admin/managers', {
                    managers: ms,
                    cities: cities
                });
            });
        })
    },
    add: function (req, res) {
        Manager.findOne({name: req.body.name}).then( m => {
            Manager.getNext().then(ids => {
                if(!m) {
                    var manager = new Manager({
                        id: ids,
                        name: req.body.name,
                        usage: false,
                        city: req.body.city
                    });
                    return manager.save();
                }
            })
        }).then(() => res.redirect('/admin/managers'));
    },
    edit: function (req, res) {
        Manager.findOne({id: req.body.id}).then( m => {
            if(m) {
                return Manager.findOne({name: req.body.newName}).then(manager => {
                    if(!manager || m.id == manager.id) {
                        m.name = req.body.newName;
                        m.city = req.body.city;
                        return m.save();
                    }
                });
            }
        }).then(() => res.status(200).send('Ok'));
    },
    delete: function (req, res) {
        Manager.findOne({id: req.body.id}).then( m => {
            if(m) {
                if(m.usage == false) return m.remove();
            }
        }).then(() => res.status(200).send('Ok'))
    }
};
