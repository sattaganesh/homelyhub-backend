import {Property} from "../Models/propertyModel.js";
import {APIFeatures} from "../utils/APIFeatures.js";
import imagekit from "../utils/ImagekitIO.js";

const getproperties=async(req,res)=>{
    try{
        const features=new APIFeatures(Property.find(),req.query)
        .filter()
        .search()
        .paginate()
        const allproperties = await Property.find();
        const doc = await features.query;
        res.status(200).json({
            status:"success",
            no_of_responses:doc.length,
            data:doc
        })
    }
    catch(error){
        console.error("Error searching properties :",error)
       res.status(500).json({error:"internal server error"})
    }
}
const getProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                status: "fail",
                message: "Property not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: property
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};
export { getproperties,getProperty}
