Vue.component('threejs', {
    props: {
        model: {
            type: String,
            required: true
        },
        door: {
            type: String,
            required: true,
        },
        desk: {
            type: String,
            required: true,
        },
        frame: {
            type: String,
            required: true,
        },
    },
    data: function(){
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, (window.innerWidth/2) / (window.innerHeight * 0.75), 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        
        return {
            scene,
            camera,
            renderer,
            renderedModel: null
        }
    },
    methods:{
        animate: function() {
            requestAnimationFrame(this.animate)
            this.renderer.render(this.scene, this.camera)
            this.controls.update()
        }
    },
    watch:{
        
        door(val){
            const textureLoader = new THREE.TextureLoader();
            const modelTexture = textureLoader.load(val, function ( texture ) {

                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set( 0, 0 );
                texture.repeat.set( 1, 1 );
            
            } );
            const mat = new THREE.MeshStandardMaterial(
                    {   
                        name: "Color L06",
                        map: modelTexture,
                        repeat: THREE.RepeatWrapping,
                    });
        
                    this.renderedModel.traverse(o => {
                        if (o.isMesh) {
                            console.log(o);
                            o.castShadow = true;
                            o.receiveShadow = true;
                            if (o.material.name == "Color L06") {
                                o.material = mat;
                            }  
                    }
                });
        },
        desk(val){
            const textureLoader = new THREE.TextureLoader();
            const modelTexture = textureLoader.load(val, function ( texture ) {

                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set( 0, 0 );
                texture.repeat.set( 1, 1 );
            
            } );
            const mat = new THREE.MeshStandardMaterial(
                    {   
                        name: "Color L01",
                        map: modelTexture,
                    });
         
           
                    this.renderedModel.traverse(o => {
                        if (o.isMesh) {
                            o.castShadow = true;
                            o.receiveShadow = true;
                            if (o.material.name == "Color L01") {
                                o.material = mat;
                            }                            
                    }
                });
        },
        frame(val){
            const textureLoader = new THREE.TextureLoader();
            const modelTexture = textureLoader.load(val, function ( texture ) {

                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set( 0, 0 );
                texture.repeat.set( 5, 5 );
            
            } );
            const mat = new THREE.MeshStandardMaterial(
                    {   
                        name: "Color M07",
                        map: modelTexture,
                    });
         
           
                    this.renderedModel.traverse(o => {
                        if (o.isMesh) {
                            o.castShadow = true;
                            o.receiveShadow = true;
                            if (o.material.name == "Color M07") {
                                o.material = mat;
                            }                            
                    }
                });
        }
    },

    created(){
        this.scene.background = new THREE.Color(0xffffff);
        this.renderer.setSize(window.innerWidth/2, window.innerHeight * 0.75);
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.shadowMap.enabled = true;
        this.renderer.physicallyCorrectLights = true;
        this.renderer.toneMapping = THREE.ReinhardToneMapping;

        const spotLight = new THREE.SpotLight(0xffffff, 15, 100, 0.6, 1.5, 0.6); //colour, intensity, distance, angle, penumbra, decay
        spotLight.position.set(5, 2, -2);
        spotLight.target.position.set(0, 0, 0);
        spotLight.castShadow = true;
        const spotLight2 = new THREE.SpotLight(0xffffff, 15, 100, 0.6, 1.5, 0.6); //colour, intensity, distance, angle, penumbra, decay
        spotLight2.position.set(1, 1, 10);
        spotLight2.target.position.set(0, 0, 0);
        spotLight2.castShadow = true;
        this.scene.add(spotLight);
        this.scene.add(spotLight2);

        // Create a light, set its position, and add it to the scene.
        const light = new THREE.HemisphereLight( 0xffffff, 0xffffff );
        //light.position.set( 0, 1, 0 );
        this.scene.add(light);

        const ambient = new THREE.AmbientLight(0xfffffff);
        this.scene.add(ambient);


        const loader = new THREE.GLTFLoader()
        loader.load(this.model, (gltf) => {
            this.renderedModel = gltf.scene;
            
            this.renderedModel.rotation.y = -Math.PI / 2;
            const box = new THREE.Box3().setFromObject( gltf.scene );
            const center = box.getCenter( new THREE.Vector3() );
            this.renderedModel.position.x += (  this.renderedModel.position.x - center.x );
            this.renderedModel.position.y += (  this.renderedModel.position.y - center.y );
            this.renderedModel.position.z += (  this.renderedModel.position.z - center.z );
                
                this.scene.add(this.renderedModel)
        
        })


        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minPolarAngle = Math.PI / 3;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 1;
        this.controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
        this.controls.autoRotateSpeed = 10; // 30
        this.camera.position.z = 4;


        this.renderer.setClearColor(0xffffff, 1);
        this.renderer.gammaOutput = true;

        
        window.addEventListener('resize', function(){
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        })

    },

    mounted(){
        this.$refs.canvas.appendChild(this.renderer.domElement);
        this.animate()
        

    },

    template: `<div ref="canvas"> </div>`

})