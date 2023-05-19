const app = new Vue({
    data() {
        return {
            doorMaterials: [
                {title:"Brazil_nut", file: "Brazil_nut.jpg"},
                {title:"European_oak", file: "European_oak.jpg"},
                {title:"Siberian_larch_2", file: "Siberian_larch_2.jpg"},
            ],
            deskMaterials: [
                {title:"multicolour-red", file: "multicolour-red.jpg"},
                {title:"Verde-marina", file: "Verde-marina.jpg"},
            ],
            frameMaterials: [
                {title:"Steel-Grey-20mm-BL6299-LFclose", file: "Steel-Grey-20mm-BL6299-LFclose.jpeg"},
                {title:"Verde-marina", file: "Verde-marina.jpg"},
            ],

            options: {},

            selected: {
                door: 0,
                desk: 0,
                frame: 0
            },
            model:"assets/modely/Gardenzio_modely_FIN_samostatne2.gltf",
            material:"",
            door:"",
            desk:"",
            frame:"",
        };
    },

    computed:{
        selectedOptions(){
            const options = [
                {name: "dvere", ...this.doorMaterials[this.selected.door]},
                {name: "dosku", ...this.deskMaterials[this.selected.desk]},
                {name: "rám", ...this.frameMaterials[this.selected.frame]},
            ]
            console.log(this.material);

            return options
        },
    },

    methods: {
        displayPopup(name){
            if(name === "dvere") this.options = {name, items: [...this.doorMaterials]}
            else if(name === "dosku") this.options = {name, items: [...this.deskMaterials]}
            else if(name === "rám") this.options = {name, items: [...this.frameMaterials]}
        },
        removePopup(){
            this.options = {}
        },
        klik(type, index){
            if(type == "dvere"){
                this.selected.door = index;
                this.door = "assets/materialy/" + this.doorMaterials[this.selected.door].file;
            }else if(type == "dosku"){
                this.selected.desk = index;
                this.desk = "assets/materialy/" + this.deskMaterials[this.selected.desk].file;
            }else if(type == "rám"){
                this.selected.frame = index;
                this.frame = "assets/materialy/" + this.frameMaterials[this.selected.frame].file;
            }
        }

    },
})

import "./components/three.js"

app.$mount("#app")