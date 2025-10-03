// controllers/listing.js
const axios = require("axios");
const Listing = require("../models/listing");

// ========================
// INDEX
// ========================
module.exports.index = async (req, res, next) => {
    let alllistings = await Listing.find();
    res.render("listings/index.ejs", { alllistings });
};

// ========================
// NEW FORM
// ========================
module.exports.renderNewform = (req, res) => {
    res.render("listings/add.ejs");
};

// ========================
// SHOW LISTING
// ========================
module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    let list1 = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!list1) {
        req.flash("error", "Listing no longer exists!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { list1 });
};

// ========================
// CREATE LISTING
// ========================
module.exports.createListing = async (req, res, next) => {
    let url = req.file?.path;
    let filename = req.file?.filename;
    let { title, description, price, location, country } = req.body;

    // Geocode with Nominatim
    let geometry = {
        type: "Point",
        coordinates: [72.8777, 19.0760], // Default Mumbai fallback
    };

    try {
        const geoResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: `${location}, ${country}`,
                format: "json",
                limit: 1,
            },
        });

        if (geoResponse.data.length > 0) {
            geometry = {
                type: "Point",
                coordinates: [
                    parseFloat(geoResponse.data[0].lon),
                    parseFloat(geoResponse.data[0].lat),
                ],
            };
        }
    } catch (err) {
        console.error("Geocoding error:", err);
    }

    const newListing = new Listing({
        title,
        description,
        image: { url, filename },
        price,
        location,
        country,
        geometry,
    });

    newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

// ========================
// EDIT FORM
// ========================
module.exports.renderEditform = async (req, res, next) => {
    let { id } = req.params;
    let list1 = await Listing.findById(id);

    if (!list1) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { list1 });
};

// ========================
// UPDATE LISTING
// ========================
module.exports.updateListing = async (req, res, next) => {
    let { id } = req.params;
    let { title, description, price, location, country } = req.body;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // --- Start: Added Geocoding Logic ---
    let geometry = listing.geometry; // Keep old geometry as a fallback

    try {
        const geoResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: `${location}, ${country}`,
                format: "json",
                limit: 1,
            },
        });

        if (geoResponse.data.length > 0) {
            geometry = {
                type: "Point",
                coordinates: [
                    parseFloat(geoResponse.data[0].lon),
                    parseFloat(geoResponse.data[0].lat),
                ],
            };
        }
    } catch (err) {
        console.error("Geocoding error during update:", err);
    }
    // --- End: Geocoding Logic ---

    // Update fields
    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.location = location;
    listing.country = country;
    listing.geometry = geometry; // <-- Assign the new geometry

    // Update image if a new one is uploaded
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};
// ========================
// DELETE LISTING
// ========================
module.exports.destroyListing = async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("delete", "Listing Deleted Successfully!");
    return res.redirect("/listings");
};
