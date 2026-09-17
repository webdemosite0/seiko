(()=>{
  const boot=()=>{
    const host=document.querySelector('.hero-watch');
    if(!host){requestAnimationFrame(boot);return}
    if(host.dataset.watch3d==='ready')return;
    if(!window.THREE||!THREE.OrbitControls){setTimeout(boot,120);return}
    host.dataset.watch3d='ready';

    let renderer;
    try{
      renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance',preserveDrawingBuffer:false});
    }catch(err){console.warn('3D viewer unavailable',err);return}

    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    renderer.setClearColor(0x000000,0);
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.1;
    if('outputEncoding' in renderer)renderer.outputEncoding=THREE.sRGBEncoding;

    const stage=document.createElement('div');
    stage.className='watch3d-stage';
    stage.setAttribute('role','application');
    stage.setAttribute('aria-label','Interactive 3D Seiko watch. Drag to rotate.');
    stage.tabIndex=0;
    stage.appendChild(renderer.domElement);

    const hint=document.createElement('div');
    hint.className='watch3d-hint';
    hint.textContent='Drag to rotate 360°';
    stage.appendChild(hint);

    const originalImage=host.querySelector('.watch-img');
    host.insertBefore(stage,originalImage||host.firstChild);
    host.classList.add('has-3d');

    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(31,1,.1,100);
    camera.position.set(0,.05,9.4);

    const controls=new THREE.OrbitControls(camera,renderer.domElement);
    controls.enableDamping=true;
    controls.dampingFactor=.07;
    controls.enablePan=false;
    controls.enableZoom=false;
    controls.autoRotate=false;
    controls.rotateSpeed=.58;
    controls.minDistance=8.2;
    controls.maxDistance=10.2;
    controls.minPolarAngle=.48;
    controls.maxPolarAngle=2.66;
    controls.target.set(0,0,0);

    const hemi=new THREE.HemisphereLight(0xdcecff,0x111923,1.9);
    scene.add(hemi);
    const key=new THREE.DirectionalLight(0xffffff,3.0);
    key.position.set(-4.5,6.5,7.5);
    key.castShadow=true;
    scene.add(key);
    const rim=new THREE.DirectionalLight(0x8abfff,2.2);
    rim.position.set(5,1,-5);
    scene.add(rim);
    const fill=new THREE.PointLight(0x2f78d8,1.5,18);
    fill.position.set(-4,-1,4);
    scene.add(fill);

    const watch=new THREE.Group();
    watch.rotation.x=-.05;
    watch.rotation.y=-.22;
    scene.add(watch);

    const steel=new THREE.MeshStandardMaterial({color:0xbfc5c8,metalness:1,roughness:.27});
    const steelDark=new THREE.MeshStandardMaterial({color:0x858d92,metalness:1,roughness:.34});
    const polish=new THREE.MeshStandardMaterial({color:0xe1e5e7,metalness:1,roughness:.16});
    const black=new THREE.MeshStandardMaterial({color:0x0b1015,metalness:.45,roughness:.3});

    const roundedRect=(w,h,r)=>{
      const s=new THREE.Shape();
      const x=-w/2,y=-h/2;
      s.moveTo(x+r,y);
      s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);
      s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
      s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);
      s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
      return s;
    };

    const caseGeo=new THREE.ExtrudeGeometry(roundedRect(3.35,3.95,.52),{
      depth:.52,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:.14,bevelThickness:.11,curveSegments:12
    });
    caseGeo.translate(0,0,-.26);
    const caseMesh=new THREE.Mesh(caseGeo,steel);
    caseMesh.castShadow=true;caseMesh.receiveShadow=true;
    watch.add(caseMesh);

    const shoulderTop=new THREE.Mesh(new THREE.BoxGeometry(2.35,.44,.64),steel);
    shoulderTop.position.set(0,1.93,0);shoulderTop.rotation.z=0;
    const shoulderBottom=shoulderTop.clone();shoulderBottom.position.y=-1.93;
    watch.add(shoulderTop,shoulderBottom);

    const bezel=new THREE.Mesh(new THREE.TorusGeometry(1.56,.11,30,120),polish);
    bezel.position.z=.34;watch.add(bezel);
    const bezelInner=new THREE.Mesh(new THREE.TorusGeometry(1.43,.035,20,120),steelDark);
    bezelInner.position.z=.405;watch.add(bezelInner);

    const dialCanvas=document.createElement('canvas');
    dialCanvas.width=dialCanvas.height=1536;
    const ctx=dialCanvas.getContext('2d');
    const cx=768,cy=768;
    const rg=ctx.createRadialGradient(cx-180,cy-140,40,cx,cy,720);
    rg.addColorStop(0,'#1559bb');rg.addColorStop(.35,'#082d75');rg.addColorStop(.72,'#03163f');rg.addColorStop(1,'#010817');
    ctx.fillStyle=rg;ctx.beginPath();ctx.arc(cx,cy,720,0,Math.PI*2);ctx.fill();
    for(let i=0;i<120;i++){
      ctx.strokeStyle=`rgba(74,132,225,${i%3===0?.07:.025})`;
      ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy);
      const a=i/120*Math.PI*2;ctx.lineTo(cx+Math.sin(a)*710,cy-Math.cos(a)*710);ctx.stroke();
    }
    ctx.save();ctx.translate(cx,cy);
    for(let i=0;i<60;i++){
      ctx.save();ctx.rotate(i*Math.PI*2/60);
      ctx.fillStyle=i%5===0?'rgba(238,243,246,.96)':'rgba(225,235,242,.72)';
      const w=i%5===0?16:6,h=i%5===0?75:27;
      ctx.fillRect(-w/2,-660,w,h);ctx.restore();
    }
    for(let i=0;i<12;i++){
      ctx.save();ctx.rotate(i*Math.PI*2/12);
      ctx.fillStyle='#e9edf0';ctx.strokeStyle='#7f888e';ctx.lineWidth=6;
      ctx.beginPath();ctx.rect(-27,-585,54,112);ctx.fill();ctx.stroke();ctx.restore();
    }
    ctx.restore();
    ctx.textAlign='center';ctx.fillStyle='#eef2f4';ctx.font='700 70px Georgia,serif';ctx.fillText('SEIKO',cx,500);
    ctx.strokeStyle='#dce2e6';ctx.lineWidth=7;ctx.fillStyle='#cfd6da';
    ctx.beginPath();ctx.roundRect(cx-55,535,110,72,16);ctx.fill();ctx.stroke();
    ctx.fillStyle='#24303a';ctx.font='700 52px Arial';ctx.fillText('5',cx,588);
    ctx.fillStyle='rgba(238,243,246,.88)';ctx.font='600 34px Arial';ctx.fillText('AUTOMATIC',cx,1040);
    ctx.fillStyle='#e8ecef';ctx.strokeStyle='#9da7ad';ctx.lineWidth=6;ctx.beginPath();ctx.roundRect(1025,705,350,112,15);ctx.fill();ctx.stroke();
    ctx.fillStyle='#161b20';ctx.font='700 49px Arial';ctx.fillText('TUE 16',1200,780);
    ctx.fillStyle='rgba(238,243,246,.72)';ctx.font='500 22px Arial';ctx.fillText('MADE IN JAPAN',cx,1320);

    const dialTexture=new THREE.CanvasTexture(dialCanvas);
    dialTexture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    if('encoding' in dialTexture)dialTexture.encoding=THREE.sRGBEncoding;
    const dial=new THREE.Mesh(new THREE.CircleGeometry(1.405,128),new THREE.MeshStandardMaterial({map:dialTexture,roughness:.31,metalness:.12}));
    dial.position.z=.405;watch.add(dial);

    const minuteTrack=new THREE.Mesh(new THREE.TorusGeometry(1.34,.014,8,120),new THREE.MeshBasicMaterial({color:0xdde3e7}));
    minuteTrack.position.z=.432;watch.add(minuteTrack);

    const makeHand=(len,width,angle,z)=>{
      const g=new THREE.Group();
      const body=new THREE.Mesh(new THREE.BoxGeometry(width,len,.045),polish);
      body.position.y=len*.38;body.castShadow=true;g.add(body);
      g.rotation.z=angle;g.position.z=z;watch.add(g);return g;
    };
    makeHand(1.12,.12,-1.05,.49);
    makeHand(1.42,.09,.76,.505);
    const sec=makeHand(1.47,.025,2.28,.525);
    sec.children[0].material=new THREE.MeshStandardMaterial({color:0xd3d8db,metalness:.9,roughness:.22});
    const pin=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.08,32),polish);pin.rotation.x=Math.PI/2;pin.position.z=.55;watch.add(pin);

    const glass=new THREE.Mesh(new THREE.CircleGeometry(1.49,128),new THREE.MeshPhysicalMaterial({color:0xcfe6ff,transparent:true,opacity:.13,roughness:.04,metalness:0,clearcoat:1,clearcoatRoughness:.04,side:THREE.DoubleSide}));
    glass.position.z=.59;watch.add(glass);

    const backDisc=new THREE.Mesh(new THREE.CircleGeometry(1.28,96),new THREE.MeshStandardMaterial({color:0x9aa1a5,metalness:1,roughness:.4,side:THREE.DoubleSide}));
    backDisc.position.z=-.39;backDisc.rotation.y=Math.PI;watch.add(backDisc);
    const backRing=new THREE.Mesh(new THREE.TorusGeometry(1.13,.055,18,96),steelDark);backRing.position.z=-.405;watch.add(backRing);

    const crown=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.32,36),steelDark);
    crown.rotation.z=Math.PI/2;crown.position.set(1.83,-.2,.02);watch.add(crown);
    const crownCap=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.03,36),polish);crownCap.rotation.z=Math.PI/2;crownCap.position.set(2,-.2,.02);watch.add(crownCap);

    const addBracelet=(dir)=>{
      const g=new THREE.Group();
      const count=7;
      for(let i=0;i<count;i++){
        const row=new THREE.Group();
        const y=dir*(2.18+i*.51);
        const z=-.04-i*.055;
        row.position.set(0,y,z);
        row.rotation.x=dir*i*.027;
        const center=new THREE.Mesh(new THREE.BoxGeometry(1.42,.43,.34),steel);
        center.castShadow=true;row.add(center);
        const sideL=new THREE.Mesh(new THREE.BoxGeometry(.7,.43,.32),steelDark);sideL.position.x=-1.02;sideL.castShadow=true;
        const sideR=sideL.clone();sideR.position.x=1.02;row.add(sideL,sideR);
        const shine=new THREE.Mesh(new THREE.BoxGeometry(1.28,.025,.012),polish);shine.position.set(0,.18,.18);row.add(shine);
        g.add(row);
      }
      watch.add(g);
    };
    addBracelet(1);addBracelet(-1);

    const claspTop=new THREE.Mesh(new THREE.BoxGeometry(2.6,.72,.35),steelDark);claspTop.position.set(0,5.78,-.45);watch.add(claspTop);
    const claspBottom=claspTop.clone();claspBottom.position.y=-5.78;watch.add(claspBottom);

    watch.scale.set(.73,.73,.73);
    watch.position.y=.02;

    const shadow=new THREE.Mesh(new THREE.CircleGeometry(2.15,64),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.18,depthWrite:false}));
    shadow.scale.set(1.2,.16,1);shadow.position.set(0,-4.18,-.8);shadow.rotation.x=-.15;scene.add(shadow);

    let alive=true,visible=true;
    const resize=()=>{
      const r=stage.getBoundingClientRect();
      const w=Math.max(1,r.width),h=Math.max(1,r.height);
      renderer.setSize(w,h,false);
      camera.aspect=w/h;camera.updateProjectionMatrix();
    };
    const ro=new ResizeObserver(resize);ro.observe(stage);resize();

    const markUsed=()=>{hint.classList.add('used')};
    renderer.domElement.addEventListener('pointerdown',()=>{stage.classList.add('is-dragging');markUsed()});
    window.addEventListener('pointerup',()=>stage.classList.remove('is-dragging'),{passive:true});
    renderer.domElement.addEventListener('keydown',e=>{
      if(e.key==='ArrowLeft'){watch.rotation.y-=.12;markUsed();e.preventDefault()}
      if(e.key==='ArrowRight'){watch.rotation.y+=.12;markUsed();e.preventDefault()}
    });

    const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true},{threshold:.03});io.observe(host);

    const mo=new MutationObserver(()=>{
      if(!stage.isConnected&&document.body.contains(host)){
        const img=host.querySelector('.watch-img');
        host.insertBefore(stage,img||host.firstChild);
        host.classList.add('has-3d');
      }
    });
    mo.observe(host,{childList:true});

    const animate=()=>{
      if(!alive)return;
      requestAnimationFrame(animate);
      if(!visible)return;
      controls.update();
      renderer.render(scene,camera);
    };
    animate();

    window.addEventListener('pagehide',()=>{alive=false;ro.disconnect();io.disconnect();mo.disconnect();controls.dispose();renderer.dispose()},{once:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();