//create pinia store named tables
import { useDataStore } from "./data";
import { defineStore } from "pinia";
import moment from "moment";

export const useTablesStore = defineStore({
    id: "tables",
    state: () => {
        return {
            customers:[],
            price_offers:[],
            projects:[],
            services_evidence:[],
            services:[],
            work_evidence:[],
            work:[],
            templates:[], 
            users:[],
        }
    },
    actions: {
        
        addCustomer(customer){
            this.customers.push(customer);
            this.customers = [...this.customers]
        },
        async addPriceOffer(price_offer){
            await this.set_customers();
            price_offer.company = this.customers.find((item)=>item.id == price_offer.customer_id).company
            this.price_offers.push(price_offer);
            this.price_offers = [...this.price_offers]
        },
        addProject(project){
            this.projects.push(project);
            this.projects = [...this.projects]
        },
        async addServiceEvidence(service_evidence){
            await this.set_customers();
            await this.set_services();
            service_evidence.company = this.customers.find((item)=>item.id == service_evidence.customer_id).company
            service_evidence.service = this.services.find((item)=>item.id == service_evidence.service_id)
            service_evidence.serviceName = service_evidence.service.name
            this.services_evidence.push(service_evidence);
            console.log(service_evidence);
            this.services_evidence = [...this.services_evidence]
        },
        addService(service){
            this.services.push(service);
            this.services = [...this.services]
        },
        async addWorkEvidence(work_evidence){
            //TODO: check workNames
            await this.set_customers();
            await this.set_work();
            work_evidence.company = this.customers.find((item)=>item.id == work_evidence.customer_id).company
            work_evidence.work = this.work.find((item)=>item.id == work_evidence.work_id)
            console.log(work_evidence.work);
            work_evidence.workName = work_evidence.work.name
            work_evidence.priceSum = useTablesStore().calcPriceSum(work_evidence["started_at"], work_evidence["ended_at"],work_evidence["price"])
            work_evidence.date = moment(work_evidence["started_at"].slice(0, 10)).format("DD.MM.YYYY")
            this.work_evidence.push(work_evidence);
            this.work_evidence.push(work_evidence);
            this.work_evidence = [...this.work_evidence]
            console.log(work_evidence);
        },
        addWork(work){
            this.work.push(work);
            this.work = [...this.work]
        },
        addUser(user){
            this.users.push(user);
            this.users = [...this.users]
        },

        async set_users(){
            const data = await useDataStore().getUsers();
            (this.users.length != data.length)
            this.users = data
        },
        async set_customers(){
            const data = await useDataStore().getCustomers();
            (this.customers.length != data.length)
            this.customers = data
        },
        async set_price_offers(){
            const data = await useDataStore().getPriceOffers();
            (this.price_offers.length != data.length)
            this.price_offers = await data
            this.price_offers.forEach((item)=>{
                item.company = item.customer.company
            })
        },
        async set_projects(){
            const data = await useDataStore().getProjects();
            (this.projects.length != data.length)
            this.projects = data
        },
        async set_services_evidence(){
            const data = await useDataStore().getServicesEvidence();
            (this.services_evidence.length != data.length)
            this.services_evidence = data
            this.services_evidence.forEach((item)=>{
                item.serviceName = item.service.name
                item.company = item.customer.company
              })
        },
        async set_services(){
            const data = await useDataStore().getServices();
            (this.services.length != data.length)
            this.services = data
        },
        async set_work_evidence(){
            const data = await useDataStore().getWorkEvidences();
            (this.work_evidence.length != data.length)
            this.work_evidence = data
            this.work_evidence.forEach((item)=>{
                item.priceSum = this.calcPriceSum(item["started_at"], item["ended_at"],item["price"])
                item.date = moment(item["started_at"].slice(0, 10)).format("DD.MM.YYYY")
                item.company = item.customer.company
                item.workName = item.work.name
            })
        },
        
        async set_work(){
            const data = await useDataStore().getWorks();
            (this.work.length != data.length)
            this.work = data
        },
        async set_templates(){
            const data = await useDataStore().getTemplates();
            (this.templates.length != data.length)
            this.templates = data
        },
        calcPriceSum(start, end,price) {
            if (end) {
              start = new Date(start)
              end = new Date(end)
              let priceSum = (((end - start)/3600000)*price).toFixed(2)
                return priceSum + "€";
            } 
            else {
              return "-";
            }
        }

    },

});