// get /api/user/

export const getUserData = async(req, res) =>{

    try {
        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;
        res.json({success:true, role, recentSearchedCities})

    }
    catch (error) {
        
        res.status(500).json({success:false,  message: error.message });
    }


}


// store user recent searched cities

export const storeRecentSearchedCities = async(req, res) =>{

    try{
        const {recentSearchedcity} = req.body;
        const user = req.user;
        if(user.recentSearchedCities.length < 3){
            user.recentSearchedCities.push(recentSearchedcity);
           
        }
        else{
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedcity);
        }
        await user.save();
        res.json({success:true,message:'city added'});

    }
    catch (error) {
        res.status(500).json({success:false,  message: error.message });
    }   
}


        

