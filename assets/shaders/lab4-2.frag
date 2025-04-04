#version 150

in vec3 ex_Normal;
in vec4 ex_Position;

out vec4 out_Color;

uniform mat4 worldToCamera;

uniform vec3 lightSourcesDirPosArr[4];
uniform vec3 lightSourcesColorArr[4];
uniform bool isDirectional[4];
uniform float specularStrength;
//uniform vec4 modelColor;

uniform sampler2D TUWater;
uniform sampler2D TUSand;
uniform sampler2D TURock;
uniform sampler2D TUDirt;
uniform sampler2D TUGrass;

in vec2 ex_TextureCoord;

vec3 lightDirection;
uniform vec3 kValues;

void main(void)
{
	vec3 Normal = normalize(ex_Normal);
	vec3 Up = normalize(vec3(worldToCamera * vec4(0,1,0,0)));
	float blendingFactor = pow(abs(dot(Normal, Up)),10);
	float worldHeight = (inverse(worldToCamera) * ex_Position).y;
	float heightThresh = 1;
	vec4 shading = vec4(0,0,0,0);
	for (int i=3; i<4; ++i)
	{
		if (isDirectional[i])
		{	
			// If directional we just want to rotate the direction vector to get the
			// new direction in camera space. Not rotate it AND translate to camera space.
			lightDirection = normalize(mat3(worldToCamera) * lightSourcesDirPosArr[i]);

		} else {
			// If positional we need to move the light in the world. Then get the vector from 
			// the light source to the "object".
			vec4 lightPosInCamera = worldToCamera * vec4(lightSourcesDirPosArr[i], 1.0);
			lightDirection = normalize(lightPosInCamera.xyz - ex_Position.xyz); 
		}
		// Diffuse
		float shade = kValues.y*max(0,dot(Normal, lightDirection));

		// Specular
		// Incident vector, I, as 0-lightDirection. Normal vector as N.
		vec3 r = reflect(-lightDirection, Normal); // Calculated as I - 2.0 * dot(N, I) * N.
		// Could also be calculated as this:
		//vec3 r = vec3(2,2,2)*Normal*dot(Normal, lightDirection)-lightDirection;

		vec3 viewDirection = normalize(-ex_Position.xyz);
		if (worldHeight < heightThresh)
		{
			shade += kValues.z*max(0,pow(dot(viewDirection,r),specularStrength)) * (1-worldHeight/heightThresh);
		}
		shading = shading + vec4( shade, shade, shade, 1 ) * vec4(lightSourcesColorArr[i],1);
	}
	// Ambient
	shading += vec4(kValues.x,kValues.x,kValues.x,0);

	if (worldHeight < heightThresh)
	{
		out_Color = texture(TUWater, ex_TextureCoord) * blendingFactor * (1-worldHeight/heightThresh) 
				  + texture(TUSand, ex_TextureCoord*10) * (1-blendingFactor) * (1-worldHeight/heightThresh)
				  + texture(TURock, ex_TextureCoord) * worldHeight/heightThresh * (1-abs(dot(Normal, Up)))
				  + texture(TUDirt, ex_TextureCoord) * abs(dot(Normal, Up)) * worldHeight/heightThresh;
	} else {
		blendingFactor = pow(abs(dot(Normal, Up)),5);
		out_Color = texture(TUGrass, ex_TextureCoord*2) * blendingFactor * (abs(dot(Normal, Up)))
				  + texture(TUDirt, ex_TextureCoord) * (1-blendingFactor) * (abs(dot(Normal, Up)))
				  + texture(TURock, ex_TextureCoord) * (1-abs(dot(Normal, Up)));
	}

	out_Color = out_Color*shading;
	//out_Color = worldToCamera * vec4(0,1,0,0);

	//out_Color = vec4(Normal,0);
}
