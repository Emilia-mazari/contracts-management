import {BadRequestException, Injectable} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDirectionDTO, updateDirectionDTO } from 'src/core/dtos/direction.dto';
import { DepartementEntity } from 'src/core/entities/Departement.entity';
import { DirectionEntity } from 'src/core/entities/Direction.entity';
import { InsertResult, Repository ,DataSource, EntityManager, UpdateResult} from 'typeorm';
@Injectable()
export class DirectionService{
    constructor(
        @InjectRepository(DirectionEntity) private readonly directionRepository:Repository<DirectionEntity>,
        private dataSource:DataSource
    ){}
    
    async createDirection(direction:CreateDirectionDTO):Promise<InsertResult>{
      
      const {departements,...otherDirectionData} = direction;
      return  await this.dataSource.manager.transaction(async (entityManger:EntityManager)=>{
        const directionDb = await entityManger.getRepository(DirectionEntity).createQueryBuilder("d")
        .where('d.title = :title or d.abriviation = :abriviation',{title:otherDirectionData.title,abriviation:otherDirectionData.abriviation}).getOne() 
        if(directionDb) throw new BadRequestException("l'abriviation ou le nom de la direction exist deja") 
        const newDirection = await entityManger.getRepository(DirectionEntity).save({...otherDirectionData});
        const departementRepository = entityManger.getRepository(DepartementEntity);
        return departementRepository.insert(direction.departements.map(dp=>{
            const departement = departementRepository.create({...dp,direction:newDirection})
            return departement;
       }))
       })
    
    }
    async findAll(offset:number  , limit:number ):Promise<DirectionEntity[]>{
        console.log(offset, limit,"limit offset")
        let q =  this.directionRepository.createQueryBuilder('direction')
        .leftJoinAndSelect('direction.departements','departements')
        .loadRelationCountAndMap('departements.users','departements.employees')
       
        console.log(".........",offset,limit,typeof offset , typeof limit)
        if(Number.isInteger(offset)  && Number.isInteger(limit)){
           q = q
            .skip(offset)
            .take(limit)
        }
        return await q.getMany();

    }
    async findDirectionWithDepartement(directionId:string,departementId:string){
        return this.directionRepository.createQueryBuilder("dr")
        .where('dr.id = :directionId',{directionId})
        .leftJoinAndSelect('dr.departements','dp')
        .andWhere('dp.id = :departementId',{departementId})
        .getOne();
    }
    async find(id:string):Promise<DirectionEntity>{
        return this.directionRepository.findOneBy({id});
    }
    async deleteDirection(id:string):Promise<string>{
       return   this.dataSource.manager.transaction(async (entityManager:EntityManager)=>{
            const directionRepository = entityManager.getRepository(DirectionEntity);
            const departementRepository = entityManager.getRepository(DepartementEntity);
            const direction = await directionRepository.createQueryBuilder('direction')
            .where('direction.id = :id',{id})
            .leftJoinAndSelect('direction.departements','departements')
            .loadRelationCountAndMap('departements.users','departements.employees')
            .getOne();
            if(!direction){
                throw new BadRequestException("la direction éxiste pas");
            }
            //@ts-ignore
            if(direction.departements.some(d=>d.users > 0)) throw new BadRequestException("l'un des departement de la direction contient des utilisateurs");
            if(direction.departements.length > 0){
                await departementRepository.createQueryBuilder()
                .delete()
                .where('departements.id in (:...ids)',{ids:direction.departements.map(dp=>dp.id)})
                .execute();

            }

            await directionRepository.delete(id);
            return "done";

        })
    }
    async updateDirection(id:string,direction:updateDirectionDTO):Promise<UpdateResult>{
        return this.directionRepository.update(id,direction);
    }

    async getTopDirection(){
        return this.directionRepository.createQueryBuilder('dr')
        .loadRelationCountAndMap('dr.agreementCount','dr.agreements')
        .getMany();
    }
    
  
}