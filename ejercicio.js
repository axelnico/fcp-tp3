// Completar la implementación de esta clase y el correspondiente vertex shader. 
// No será necesario modificar el fragment shader a menos que, por ejemplo, quieran modificar el color de la curva.
class CurveDrawer 
{
	// Inicialización de los shaders y buffers
	constructor()
	{
		// Creamos el programa webgl con los shaders para los segmentos de recta
		this.prog   = InitShaderProgram( curvesVS, curvesFS );

		// [Completar] Incialización y obtención de las ubicaciones de los atributos y variables uniformes
		
		this.m = gl.getUniformLocation(this.prog,'mvp');
		this.p0 = gl.getUniformLocation(this.prog,'p0');
		this.p1 = gl.getUniformLocation(this.prog,'p1');
		this.p2 = gl.getUniformLocation(this.prog,'p2');
		this.p3 = gl.getUniformLocation(this.prog,'p3');
		this.t = gl.getAttribLocation(this.prog, 't');
		
		// Muestreo del parámetro t
		this.steps = 100;
		var tv = [];
		for ( var i=0; i<this.steps; ++i ) {
			tv.push( i / (this.steps-1) );
		}
		
		// [Completar] Creacion del vertex buffer y seteo de contenido
		this.buffer = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tv), gl.STATIC_DRAW);
		
	}

	// Actualización del viewport (se llama al inicializar la web o al cambiar el tamaño de la pantalla)
	setViewport( width, height )
	{
		// [Completar] Matriz de transformación.
		// [Completar] Binding del programa y seteo de la variable uniforme para la matriz. 

		var trans = [ 2/width,0,0,0,  0,-2/height,0,0, 0,0,1,0, -1,1,0,1 ];

		gl.useProgram(this.prog);
		
		gl.uniformMatrix4fv(this.m, false, trans);

	}

	updatePoints( pt )
	{
		// [Completar] Actualización de las variables uniformes para los puntos de control
		// [Completar] No se olviden de hacer el binding del programa antes de setear las variables 
		// [Completar] Pueden acceder a las coordenadas de los puntos de control consultando el arreglo pt[]:
		// var x = pt[i].getAttribute("cx");
		// var y = pt[i].getAttribute("cy");
		var p = [];
		for ( var i=0; i<4; ++i ) 
		{
			var x = pt[i].getAttribute("cx");
			var y = pt[i].getAttribute("cy");
			
			p.push(x);
			p.push(y);
		}

		gl.useProgram(this.prog);
		
		gl.uniform2f(this.p0, p[0],p[1]);
		gl.uniform2f(this.p1, p[2],p[3]);
		gl.uniform2f(this.p2, p[4],p[5]);
		gl.uniform2f(this.p3, p[6],p[7]);
	}

	draw()
	{
		// [Completar] Dibujamos la curva como una LINE_STRIP
		// [Completar] No se olviden de hacer el binding del programa y de habilitar los atributos de los vértices
		gl.useProgram(this.prog);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.vertexAttribPointer(this.t,1,gl.FLOAT, false, 0, 0);
	
		gl.enableVertexAttribArray(this.t);
		gl.drawArrays(gl.LINE_STRIP,0,this.steps);
	}
}

// Vertex Shader
//[Completar] El vertex shader se ejecuta una vez por cada punto en mi curva (parámetro step). No confundir punto con punto de control.
// Deberán completar con la definición de una Bezier Cúbica para un punto t. Algunas consideraciones generales respecto a GLSL: si
// declarás las variables pero no las usás, no se les asigna espacio. Siempre poner ; al finalizar las sentencias. Las constantes
// en punto flotante necesitan ser expresadas como X.Y, incluso si son enteros: ejemplo, para 4 escribimos 4.0
var curvesVS = `
	attribute float t;
	uniform mat4 mvp;
	uniform vec2 p0;
	uniform vec2 p1;
	uniform vec2 p2;
	uniform vec2 p3;
	void main()
	{ 
		vec2 bezierPos = pow(1.0-t,3.0)*p0 + 3.0*pow(1.0-t,2.0)*t*p1 + 3.0*(1.0-t)*pow(t,2.0)*p2 + pow(t,3.0)*p3;
		gl_Position = mvp * vec4(bezierPos,0,1);
	}
`;

// Fragment Shader
var curvesFS = `
	precision mediump float;
	void main()
	{
		gl_FragColor = vec4(0,0,1,1);
	}
`;
