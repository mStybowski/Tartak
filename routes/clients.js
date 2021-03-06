var Client = require("../models/client");
var express = require("express");
var middlewareObj = require("../middleware/index.js");
var Order = require("../models/order");
var Price = require("../models/price");

var router = express.Router();

router.get("/", middlewareObj.redirectIfNotLoggedIn, function(req, res){
    Client.find({}).sort({lastName: 1}).exec(function(err, foundClients){
        if(err){
            req.flash("error", "Nie znaleziono klientów");
            res.redirect("/");
        }
        else{
            res.render("clients/all", {clients: foundClients});
        }
    });
});

router.put("/:id", function(req, res){
    Client.findByIdAndUpdate(req.params.id, req.body.client, function(err, updatedClient){
        if(err)
            res.redirect("/clients");
        else{
            req.flash("success", "Zaktualizowano dane klienta");
            res.redirect("/clients/");
        }
    });
});

router.get("/new", middlewareObj.redirectIfNotLoggedIn, function(req, res){
    res.render("clients/new");
});



router.post("/", middlewareObj.redirectIfNotLoggedIn, function(req, res){
    let newClient = req.body.client;

    Client.create(newClient, function(err, newlyCreatedClient){
        if(err)
        {
            req.flash("error", "Klient nie mógł być utworzony")
            res.redirect("/clients");
        }
        else{
            req.flash("success", "Klient zapisany")
            res.redirect("/clients/" + newlyCreatedClient._id);
        }
    })
});
router.get("/:id/edit", middlewareObj.redirectIfNotLoggedIn, function(req, res){

    Client.findById(req.params.id, function(err, foundClient){
        if(err){
            req.flash("error", "Klient nie został znaleziony");
            res.redirect("/");
        }
        else{
            res.render("clients/edit", {customer: foundClient});
        }
    });
});

router.delete("/:id", function(req, res){
    Client.findByIdAndDelete(req.params.id, (err) =>{
        if(err){
            res.redirect("/");
        }
        else {
            req.flash("success", "Usunięto klienta");
            res.redirect("/clients");
        }
    });
});

router.get("/:id", middlewareObj.redirectIfNotLoggedIn, function(req, res){

    Client.findById(req.params.id, function(err, foundClient){
            if(err){
                req.flash("error", "Klient nie został znaleziony");
                res.redirect("/");
            }
            else{
                console.log(foundClient);
                res.render("clients/show", {person: foundClient});
            }
        });
});

module.exports = router;