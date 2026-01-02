const User = require('../models/User');
class UserController {
    async getAllUsers(req,res){
        try{
        const page = +req.query.page||1;
        const users = await User.paginate({page,limit:2});
        if(!users){
            return res.status(404).json({
                success: false,
                message:"there is no users to show",
            });
        }
        return res.status(200).json({
            success: true,
            data: users
        });
        }catch(error){
            return res.status(500).json({
                success:false,
                message: error.message,
            });
        }
    }
    
    async findUserById(req,res){
        try{
            const {id} = req.params;
            const user = await User.findById(id);
            if(!user){
                return res.status(404).json({
                    success:false,
                    message:"User not found"
                });
            }
            return res.status(200).json({
                success:true,
                data:user
            });
        }catch(error){
            return res.status(500).json({
                success:false,
                message: error.message,
            })
        }
    }
    async deleteUser(req,res){
        try{
            const {id}= req.params;
            const user = await User.findByIdAndDelete(id);
            if(!user){
                return res.status(404).json({
                    succcess:false,
                    message:"User not found",
                });
            }
            return res.status(200).json({
                success:true,
                message: " User deleted successfully",
            });
        }catch(error){
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }

    async updateUser(req,res){
        try{
            const {id} = req.params;
            const{name,role} = req.body;
            const user =await User.findById(id);
            if(!user){
                return res.status(404).json({
                    success: false,
                    message:"User not found"
                });
            }
            user.name = name??user.name;
            user.role = role??user.role;
            await user.save();
            return res.status(200).json({
                success: true,
                message:"User updated successfully",
                user: user,
            });
        }catch(error){
            return res.status(500).json({
                success:false,
                message:error.message,

            });
        }
    }


}
module.exports = new UserController();