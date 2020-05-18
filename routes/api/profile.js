const express = require("express")
const router = express.Router()
const config = require("config")
const request = require("request")
const auth = require("../../middleware/auth");

const Profile = require("../../models/Profile")
const User = require("../../models/User")

// @route GET api/profile/me
// @desc Get current users profile
// @access Private

router.get("/me", auth, async(req, res) =>{
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate("user", ["name", "email"]);

        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route Post api/profile
// @desc create or update a profile
// @access Private

router.post("/", auth, async(req,res) =>{
    const{
        bio,
        location,
        facebook,
        twitter,
        instagram
    } = req.body

    // profile object
    const profileObject ={}
    profileObject.user = req.user.id
    if(bio) profileObject.bio = bio
    if(location) profileObject.location = location

    profileObject.socialMedia = {}
    if(facebook) profileObject.socialMedia.facebook = facebook
    if(twitter) profileObject.socialMedia.twitter = twitter
    if(instagram) profileObject.socialMedia.instagram = instagram

    try {
        const profile = new Profile(profileObject)
        await profile.save()
        res.json(profile)
    } catch (error) {
        console.error(error.message)
    res.status(500).send("server error")
    }
    

})

module.exports= router