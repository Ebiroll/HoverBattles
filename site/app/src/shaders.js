var Cache = Cache || {};
Cache.Shaders = 
{"glow":{"Fragment":"#ifdef GL_ES\nprecision highp float;\n#endif\n\nvarying vec2 vTextureCoords;\nuniform sampler2D uBlurred;\nuniform sampler2D uScene;\n\nvoid main(void) {\n  vec4 rawBlurColour = texture2D(uBlurred, vec2(vTextureCoords.s, vTextureCoords.t));\n  vec4 rawSceneColour =  texture2D(uScene, vec2(vTextureCoords.s, vTextureCoords.t));\n\n\tgl_FragColor = vec4((rawBlurColour.rgb + rawSceneColour.rgb) * 1.1, 1.0);\n}\n","Shader":"attribute vec3 aVertexPosition;\nattribute vec2 aTextureCoords;\nuniform mat4 uProjection;\nuniform mat4 uView;\nuniform mat4 uWorld;\n\nvarying vec2 vTextureCoords;\n\nvoid main(void){\n\tgl_Position =  uProjection * uView * uWorld * vec4(aVertexPosition, 1.0);\n  vTextureCoords = aTextureCoords;\n}\n"},"blury":{"Shader":"attribute vec3 aVertexPosition;\nattribute vec2 aTextureCoords;\nuniform mat4 uProjection;\nuniform mat4 uView;\nuniform mat4 uWorld;\n\nvarying vec2 vTextureCoords;\n\nvoid main(void){\n\tgl_Position =  uProjection * uView * uWorld * vec4(aVertexPosition, 1.0);\n  vTextureCoords = aTextureCoords;\n}\n","Fragment":"#ifdef GL_ES\nprecision highp float;\n#endif\n\nconst float blurSize = 1.0/512.0;\n\nvarying vec2 vTextureCoords;\nuniform sampler2D uSampler;\n\n\nvoid main(void) {\n\n   vec4 sum = vec4(0.0);\n\n   sum += texture2D(uSampler, vec2(vTextureCoords.x, vTextureCoords.y - 4.0*blurSize)) * 0.05;\n   sum += texture2D(uSampler, vec2(vTextureCoords.x, vTextureCoords.y - 3.0*blurSize)) * 0.09;\n   sum += texture2D(uSampler, vec2(vTextureCoords.x, vTextureCoords.y - 2.0*blurSize)) * 0.12;\n   sum += texture2D(uSampler, vec2(vTextureCoords.x, vTextureCoords.y - blurSize)) * 0.15;\n   sum += texture2D(uSampler, vec2(vTextureCoords.x, vTextureCoords.y)) * 0.16;\n   sum += texture2D(uSampler, vec2(vTextureCoords.x, vTextureCoords.y + blurSize)) * 0.15;\n   sum += texture2D(uSampler, vec2(vTextureCoords.x, vTextureCoords.y + 2.0*blurSize)) * 0.12;\n   sum += texture2D(uSampler, vec2(vTextureCoords.x, vTextureCoords.y + 3.0*blurSize)) * 0.09;\n   sum += texture2D(uSampler, vec2(vTextureCoords.x, vTextureCoords.y + 4.0*blurSize)) * 0.05;\n\n   gl_FragColor = sum;\n}\n"},"landscape":{"Shader":"attribute vec2 aVertexPosition;\nattribute float aVertexHeight;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uProjection;\nuniform mat4 uView;\nuniform mat4 uWorld;\n\nvarying vec2 vTexCoords;\n\nvoid main(void){\n    vTexCoords = aTextureCoord;\n    vec4 transformedPosition =   uView * uWorld * vec4(aVertexPosition.x, aVertexHeight, aVertexPosition.y, 1.0);\n    gl_Position = uProjection * transformedPosition;\n}\n","Fragment":"#ifdef GL_ES\nprecision highp float;\n#endif\n\nvarying vec2 vTexCoords;\nuniform sampler2D uSampler;\n\nvoid main(void) {    \n\n    // Multiplying up the texture coords so we repeat the texture a bit more often\n    gl_FragColor = texture2D(uSampler, vec2(vTexCoords.s * 20.0, vTexCoords.t * 20.0));\n\n}\n"},"hud":{"Shader":"attribute vec3 aVertexPosition;\nattribute vec2 aTextureCoords;\nuniform mat4 uProjection;\nuniform mat4 uView;\nuniform mat4 uWorld;\n\nvarying vec2 vTextureCoords;\n\nvoid main(void){\n\tgl_Position =  uProjection * uView * uWorld * vec4(aVertexPosition, 1.0);\n  vTextureCoords = aTextureCoords;\n}\n","Fragment":"#ifdef GL_ES\nprecision highp float;\n#endif\n\nvarying vec2 vTextureCoords;\nuniform sampler2D uSampler;\n\nvoid main(void) {\n  vec4 colour =  texture2D(uSampler, vec2(vTextureCoords.s, vTextureCoords.t));\n\tgl_FragColor = colour;\n}\n"},"specular":{"Fragment":"#ifdef GL_ES\nprecision highp float;\n#endif\n\nvarying vec2 vTextureCoord;\nvarying vec3 vDirectionToLight;\nvarying vec3 vHalfNormal;\nvarying vec3 vNormal;\n\nuniform sampler2D uBumpSampler;\n\nvoid main(void) {\n\n    // Sample the texture to get our new normal in texture space\n    vec3 bumpNormal = (texture2D(uBumpSampler, vTextureCoord.st)).rgb * 2.0 - 1.0;\n\n    vec3 diffuse = clamp(dot(bumpNormal, vDirectionToLight), 0.0, 1.0) * vec3(1.0, 1.0, 1.0);\n    float specularComponent = clamp(dot(bumpNormal, normalize(vHalfNormal)), 0.0, 1.0);\n\n    vec3 specular = pow(specularComponent, 64.0) * vec3(0.4,0.4,0.9);    \n    vec3 light = diffuse + specular;\n    gl_FragColor =  vec4(light, 1.0); \n}\n","Shader":"attribute vec3 aVertexPosition;\nattribute vec3 aNormal;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uProjection;\nuniform mat4 uView;\nuniform mat4 uWorld;\nuniform mat3 uNormal;\nuniform vec3 uLightPosition;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vDirectionToLight;\nvarying vec3 vHalfNormal;\nvarying vec3 vNormal;\n\nvoid main(void){\n    vec3 tangent = normalize(uNormal * vec3(1,0,0));\n    vec3 normal = normalize(uNormal * aNormal);\n    vec3 bitangent = normalize(cross(tangent, normal));\n    mat3 transform = mat3(tangent, bitangent, normal);\n\n    vec4 transformedPosition = uView * uWorld * vec4(aVertexPosition, 1.0);\n    vec3 directionToCamera =  normalize(-vec3(transformedPosition));\n    vec3 directionToLight = normalize(uLightPosition - vec3(transformedPosition));\n\n    // Transform vectors to texture space\n    vDirectionToLight = directionToLight * transform;\n    vHalfNormal = normalize(vDirectionToLight + (directionToCamera * transform));\n\n    vNormal = normal * transform;\n    vTextureCoord = aTextureCoord;\n    gl_Position =  uProjection * transformedPosition;\n}\n"},"default":{"Shader":"attribute vec3 aVertexPosition;\nuniform mat4 uProjection;\nuniform mat4 uView;\nuniform mat4 uWorld;\n\nvoid main(void){\n\tgl_Position =  uProjection * uView * uWorld * vec4(aVertexPosition, 1.0);\n}\n","Fragment":"#ifdef GL_ES\nprecision highp float;\n#endif\nvoid main(void) {\n\tgl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n}\n"},"colour":{"Shader":"attribute vec3 aVertexPosition;\nattribute vec4 aVertexColour;\n\nuniform mat4 uProjection;\nuniform mat4 uView;\nuniform mat4 uWorld;\n\nvarying vec4 vColour;\n\nvoid main(void){\n\tgl_Position =  uProjection * uView * uWorld * vec4(aVertexPosition, 1.0);\n\tvColour = aVertexColour;\n}\n","Fragment":"#ifdef GL_ES\nprecision highp float;\n#endif\n\nvarying vec4 vColour;\n\n\nvoid main(void) {\n\tgl_FragColor = vColour;\n\n}\n"},"texture":{"Shader":"attribute vec3 aVertexPosition;\nattribute vec2 aTextureCoords;\nattribute vec3 aNormals;\n\nuniform mat4 uProjection;\nuniform mat4 uView;\nuniform mat4 uWorld;\nuniform mat3 uNormalMatrix;\n\nvarying vec2 vTextureCoords;\nvarying vec3 vNormal;\nvarying vec3 vVectorToLight;\n\nvoid main(void){\n    vec4 lightPosition = vec4(0.0,250.0, 0.0, 0.0);\n    vec4 transformedPosition =  uView * uWorld * vec4(aVertexPosition, 1.0);\n    gl_Position =  uProjection * transformedPosition;\n\n    vNormal = uNormalMatrix * aNormals;\n    vVectorToLight = vec3(lightPosition - transformedPosition);\n    vTextureCoords = aTextureCoords;\n}\n","Fragment":"#ifdef GL_ES\nprecision highp float;\n#endif\n\nvarying vec2 vTextureCoords;\nvarying vec3 vNormal;\nvarying vec3 vVectorToLight;\nuniform sampler2D uSampler;\n\nvoid main(void) {\n  vec3 normal  = normalize(vNormal);\n  vec3 vector = normalize(vVectorToLight);\n\n  vec4 colour =  texture2D(uSampler, vec2(vTextureCoords.s, vTextureCoords.t));\n  float diffuse = max(dot(normal, vector), 0.0);\n  vec4 lightColour = vec4(colour.rgb * diffuse, 0.5);\n  vec4 ambientColour = vec4(colour.rgb * 0.1, 0.5);\n  gl_FragColor = lightColour + ambientColour;\n}\n"},"blurx":{"Shader":"attribute vec3 aVertexPosition;\nattribute vec2 aTextureCoords;\nuniform mat4 uProjection;\nuniform mat4 uView;\nuniform mat4 uWorld;\n\nvarying vec2 vTextureCoords;\n\nvoid main(void){\n\tgl_Position =  uProjection * uView * uWorld * vec4(aVertexPosition, 1.0);\n  vTextureCoords = aTextureCoords;\n}\n","Fragment":"#ifdef GL_ES\nprecision highp float;\n#endif\n\nconst float blurSize = 1.0/512.0;\n\nvarying vec2 vTextureCoords;\nuniform sampler2D uSampler;\n\n\nvoid main(void) {\n\n   vec4 sum = vec4(0.0);\n\n   sum += texture2D(uSampler, vec2(vTextureCoords.x - 4.0*blurSize, vTextureCoords.y)) * 0.05;\n   sum += texture2D(uSampler, vec2(vTextureCoords.x - 3.0*blurSize, vTextureCoords.y)) * 0.09;\n   sum += texture2D(uSampler, vec2(vTextureCoords.x - 2.0*blurSize, vTextureCoords.y)) * 0.12;\n   sum += texture2D(uSampler, vec2(vTextureCoords.x - blurSize, vTextureCoords.y)) * 0.15;\n   sum += texture2D(uSampler, vec2(vTextureCoords.x, vTextureCoords.y)) * 0.16;\n   sum += texture2D(uSampler, vec2(vTextureCoords.x + blurSize, vTextureCoords.y)) * 0.15;\n   sum += texture2D(uSampler, vec2(vTextureCoords.x + 2.0*blurSize, vTextureCoords.y)) * 0.12;\n   sum += texture2D(uSampler, vec2(vTextureCoords.x + 3.0*blurSize, vTextureCoords.y)) * 0.09;\n   sum += texture2D(uSampler, vec2(vTextureCoords.x + 4.0*blurSize, vTextureCoords.y)) * 0.05;\n \n   gl_FragColor = sum;\n}\n"},"particles":{"Shader":"attribute vec3 aVertexPosition;\nattribute vec3 aVelocity;\nattribute vec3 aColour;\nattribute float aSize;\nattribute float aCreationTime;\nattribute float aLifetime;\n\nuniform mat4 uProjection;\nuniform mat4 uView;\n\nuniform float maxsize;\nuniform float time;\nuniform vec3 vCamera;\n\nvarying vec3 vColour;\nvarying float life;\n\nvoid main(void){\n\n    float age = (time - aCreationTime);\n    vec3 position = aVertexPosition + (aVelocity * age);\n    vColour = aColour;\n\n    vec3 vectorToPoint = (position - vCamera);\n    float distanceSquared = abs(dot(vectorToPoint, vectorToPoint));\n    float scale = clamp(distanceSquared, 1.0, 10000.0);      \n\n    life = 1.0 - (age / aLifetime);\n    life = clamp(life, 0.0, 1.0);\n\n    gl_PointSize = (aSize * maxsize) / (scale / 100.0);\n    gl_Position =  uProjection * uView * vec4(position, 1.0);\n}\n","Fragment":"#ifdef GL_ES\nprecision highp float;\n#endif\n\nvarying float life;\nvarying vec3 vColour;\n\nuniform sampler2D uSampler;\nuniform float time;\n\nvoid main(void) {\n    vec4 texColor = texture2D(uSampler, gl_PointCoord);\n    vec4 colour = vec4(texColor.r, texColor.g, texColor.b, texColor.a * life);\n    gl_FragColor =  colour;\n}\n"}};