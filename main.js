
var cena = new THREE.Scene(); 

cena.background = new THREE.Color(0xE5E5DA)

let botoes = []
let objetos = []

let relogio = new THREE.Clock()
let misturador = new THREE.AnimationMixer(cena)


let meuCanvas = document.getElementById('meuCanvas')

let renderer = new THREE.WebGLRenderer({canvas: meuCanvas})
renderer.setSize( 650, 450 )
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 4;

var camara = new THREE.PerspectiveCamera( 70, 800 / 600, 0.01, 1000 )

var controlos = new THREE.OrbitControls( camara, renderer.domElement )

var carregador = new THREE.GLTFLoader()

var material_antigo

carregador.load(
 'estanteComTV2.gltf', 
 function ( gltf ) {

 cena.add( gltf.scene )


 cena.traverse(function(x)
 {
    if(x.isMesh)
        x.castShadow = true
        x.receiveShadow = true
        if(x.name == 'rack')
        {
            alvo = x;
            material_antigo = alvo.material;
        }
        else if(x.name == 'drawerUpBotao' || x.name == 'drawerDownBotao' || x.name == 'doorLeftBotao' || x.name == 'doorRightBotao')
        {
            botoes.push(x)
        }
        
 }
 )
    drawerUpOpen = THREE.AnimationClip .findByName(gltf.animations, 'drawerUpOpen'),
    acaodrawerUpOpen = misturador.clipAction(drawerUpOpen)

    drawerDownOpen = THREE.AnimationClip .findByName(gltf.animations, 'drawerDownOpen.001'),
    acaodrawerDownOpen = misturador.clipAction(drawerDownOpen)

    doorLeftOpen = THREE.AnimationClip .findByName(gltf.animations, 'doorLeftOpen'),
    acaoDoorLeftOpen = misturador.clipAction(doorLeftOpen)

    doorRightOpen = THREE.AnimationClip .findByName(gltf.animations, 'doorRightOpen'),
    acaoDoorRightOpen = misturador.clipAction(doorRightOpen)

}
)


//MATERIAL

document.getElementById('btn_top_material').onclick = function(){
    //creates texture
    var texture = new THREE.TextureLoader().load('textures/Wood028_2K_Color.png')
    changeTexture(texture)
}


document.getElementById('btn_top_material2').onclick = function(){
    //creates texture
    var texture = new THREE.TextureLoader().load('textures/Wicker001_1K_Color.png')
    changeTexture(texture)
}

var btnRepor = document.getElementById('btn_repor')
btnRepor.addEventListener('click', reporMaterial);

//CORES
const red = new THREE.Color('red');
const yellow = new THREE.Color( 'yellow' );

let btnCor = document.getElementById('btn_cor')
btnCor.addEventListener('input', mudarCor);




//RAYCASTER 

let raycaster = new THREE.Raycaster()
let rato = new THREE.Vector2()

window.onclick = function(evento) 
{
    let limites = evento.target.getBoundingClientRect()
    
    rato.x = (evento.clientX - limites.left) / parseInt(meuCanvas.style.width) * 2 - 1

    rato.y = -(evento.clientY - limites.top) / parseInt(meuCanvas.style.height) * 2 + 1
    // invocar raycaster
    pegarPrimeiro() 
}


renderer.shadowMap.enabled = true


camara.position.x = -5
camara.position.y = 8
camara.position.z = 13
camara.lookAt( 0, 2, 0 )


console.log(cena)

function renderizar() 
{ 

    requestAnimationFrame( renderizar)
    misturador.update( relogio.getDelta() )
    renderer.render( cena, camara )
   

}


function mudarCor()
{
    color = new THREE.Color( btnCor.value );
    
   alvo.material.color = color;
   console.log(btnCor.value)

}



function pegarPrimeiro() 
{

    raycaster.setFromCamera(rato, camara)
    let intersetados = raycaster.intersectObjects(botoes)
  
    if (intersetados.length > 0) {
        // fazer o que houver a fazer com o primeiro interesetado
       // alert("teste")
    
        console.log(intersetados.length)
        console.log(intersetados[0].object.name)
        switch(intersetados[0].object.name)
        {
            case 'drawerUpBotao':
            
                animacao(acaodrawerUpOpen)
                break;
            case 'drawerDownBotao':
            
                animacao(acaodrawerDownOpen)
                break;
            case 'doorLeftBotao':
            
                animacao(acaoDoorLeftOpen)
                break; 
            case 'doorRightBotao':
            
                animacao(acaoDoorRightOpen)
                break; 
        }
        
    }
}


function animacao(acao)
{
    if(acao.paused = true)
    {
            acao.paused = false           
    }
    if(acao.timeScale == 1)
    {
        acao.clampWhenFinished =  true
        acao.setLoop( THREE.LoopOnce );
        acao.play();

        misturador.addEventListener( 'finished', function( e ) //qnd a animação termina 
        {                                                      //reverte a time scale para da proxima vez que o elemento for acionado fazer a animação pretendida
             acao.timeScale = -1
        } ); // properties of e: type, action and direction
        
    }
    else
    {
        acao.clampWhenFinished =  true
        acao.setLoop( THREE.LoopOnce );
        acao.play();
        
        misturador.addEventListener( 'finished', function( e ) 
        {
             acao.timeScale = 1
        } ); // properties of e: type, action and direction
    }

}

function addLights(){
    const lightAmb = new THREE.AmbientLight( 0xffffff, 0.5); 
    cena.add( lightAmb );

    const lightDir = new THREE.DirectionalLight( 0xE5E5DA, 1 );
    lightDir.position.set(2,8,10)
    cena.add( lightDir );
}


function changeTexture(material)
{
    let madeira = new THREE.MeshBasicMaterial({map:material})
    cena.getObjectByName('rack').material = madeira
    cena.getObjectByName('shelf').material = madeira
    cena.getObjectByName('doorRight').material = madeira
    cena.getObjectByName('doorLeft').material = madeira
    cena.getObjectByName('drawerDown').material = madeira
    cena.getObjectByName('drawerUp').material = madeira
    cena.getObjectByName('Cube006').material = madeira
    cena.getObjectByName('Cube006_1').material = madeira
    
}

function reporMaterial()
{
    //let material = new THREE.MeshBasicMaterial({map:material_antigo})
    cena.getObjectByName('rack').material = material_antigo
    cena.getObjectByName('shelf').material = material_antigo
    cena.getObjectByName('doorRight').material = material_antigo
    cena.getObjectByName('doorLeft').material = material_antigo
    cena.getObjectByName('drawerDown').material = material_antigo
    cena.getObjectByName('drawerUp').material = material_antigo
}


addLights()
renderizar();
