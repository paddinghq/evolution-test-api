import express,{NextFunction, Request, Response} from 'express';
import { UserModel } from "../models/userModel"
import { ResourceNotFound } from '../middlewares/errorHandler';


class userService {
  /**
   * @method getAllUsers
   * @static
   * @async
   * @returns {Promise<IUsers>}
   */

  static async getAllUsers(req:Request, res:Response, next:NextFunction) {
    try {
      const users = await UserModel.find();

      if (users) {
        return res.status(401).json({
          message: `Users retrieved successfully`,
          data: users,
        })
      }
    } catch (error) {
      console.log(error)
      // return res.status(500).json({
      //   message: 'Internal Server Error',
      //   success: false,
      // })

      next(error)
    }
  }



  /**
 * @method getUser
 * @static
 * @async
 * @returns {Promise<IUsers>}
 */

static async getUser(req: Request, res: Response, next: NextFunction){
  try{      
    const id: string = req.params.id

    const user = await UserModel.findOne({_id: id}, {password: 0})

    if (!user){
      throw new ResourceNotFound("No user found!!")
    }
    
    return res.status(201).json({success: true, message: `User with id: ${id} retrieved successfully!`, data: user})
    


  }catch(error){
    console.log(error)
    
    next(error)


  }
}

}





export default userService;