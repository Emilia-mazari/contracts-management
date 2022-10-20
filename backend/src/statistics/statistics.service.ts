import { Injectable } from "@nestjs/common";
import { AgreementService } from "src/Agreement/services/Agreement.service";
import { VendorService } from "src/Agreement/services/vendor.service";
import { UserService } from "src/user/user.service";


@Injectable()
export class StatisticsService{
    constructor(
        private readonly userService:UserService,
        private readonly agreeementService:AgreementService,
        private readonly vendorService:VendorService
    ){}
    async getStats(startDate:Date , endDate:Date){
        const [userTypes,vendorsStats,agreementsStats]= await Promise.all([
            this.userService.getUserTypesStats(),
            this.vendorService.getVendorsStats(startDate,endDate),
            this.agreeementService.getAgreementsStats()
        ])

        return {
            userTypes,
            vendorsStats,
            agreementsStats
        }
    }
}