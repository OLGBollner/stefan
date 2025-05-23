#include "camera.h"
#include "VectorUtils4.h"
#include <vector>

#include <iostream>

Camera::Camera(vec3 const& position)
: pitchMatrix{Rx(0)}, yawMatrix{Ry(0)}, position{position},
    pitch{0}, yaw{0}, near{0.5f}, far{100.f}, aspect{16.f/9.f}, fov{60},
    movementSpeed{0.2}, sensitivity{0.001}
{}

void Camera::handleInput(vec2 const& mouseMovedVec, bool const* keyDown)
{
    vec2 mouseMoved {mouseMovedVec.x * sensitivity, mouseMovedVec.y * sensitivity};

    yaw += mouseMoved.x;
    yawMatrix = Ry(yaw);

    pitch += pitch + mouseMoved.y < M_PI_2 
        && pitch + mouseMoved.y > -M_PI_2
        ? mouseMoved.y : 0;

    pitchMatrix = Rx(pitch);

    updatePosition(keyDown);
}

void Camera::updatePosition(bool const* keyDown)
{
    vec3 movement {0,0,0}; 
    if (keyDown['w'])
    {
        movement += vec3{0,0,movementSpeed};
    }       
    if (keyDown['a'])
    {       
        movement += vec3{movementSpeed,0,0};
    }       
    if (keyDown['s'])
    {       
        movement += vec3{0,0,-movementSpeed};
    }       
    if (keyDown['d'])
    {       
        movement += vec3{-movementSpeed,0,0};
    }       
    if (keyDown[' '])
    {       
        movement += vec3{0,-movementSpeed,0};
    }       
    if (keyDown[GLUT_KEY_CONTROL])
    {       
        movement += vec3{0,movementSpeed,0};
    }

    movement = normalize(movement) * movementSpeed;
            
    position += transpose(yawMatrix) * vec4{movement.x, movement.y, movement.z, 0};
}

mat4 Camera::getWorldToCamera() const
{
    return pitchMatrix * yawMatrix * T(position.x, position.y, position.z);
}

mat4 Camera::getProjectionMat() const
{
    return perspective((M_PI/180) * fov, aspect, near, far);
}

vec3 Camera::getPosition() const
{
    return position;
}

vec2 Camera::getFrustumBounds() const
{
    return vec2{near, far};
}
