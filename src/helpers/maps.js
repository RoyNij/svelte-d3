import {
	cross,
	dot
} from './linearAlgebra';

// Most to all of this comes from http://bl.ocks.org/ivyywang/7c94cb5a3accd9913263

const to_radians = Math.PI / 180
const to_degrees = 180 / Math.PI

export function toRadians( degrees ){
	return degrees * Math.PI / 180;
}

export function toDegrees( radians ){
	return radians * 180 / Math.PI;
}

export function geoToCartesian( coord ){
	const lon = toRadians( coord[ 0 ] );
	const lat = toRadians( coord[ 1 ] );

	return [
		Math.cos( lat ) * Math.cos( lon ),
		Math.cos( lat ) * Math.sin( lon ),
		Math.sin( lat )
	]
}

// Helper function: 
// This function computes a quaternion representation for the rotation between to vectors [x, y, z]
// https://en.wikipedia.org/wiki/Rotation_formalisms_in_three_dimensions#Euler_angles_.E2.86.94_Quaternion
function quaternion(v0, v1) {
	if (v0 && v1) {
		
	    var w = cross(v0, v1),  // vector pendicular to v0 & v1
	        w_len = Math.sqrt(dot(w, w)); // length of w     

        if (w_len == 0)
        	return;

        var theta = .5 * Math.acos(Math.max(-1, Math.min(1, dot(v0, v1)))),

	        qi  = w[2] * Math.sin(theta) / w_len,
	        qj  = - w[1] * Math.sin(theta) / w_len,
	        qk  = w[0]* Math.sin(theta) / w_len,
	        qr  = Math.cos(theta);

	    return theta && [qr, qi, qj, qk];
	}
}

// Helper function: 
// This functions converts euler angles to quaternion
// https://en.wikipedia.org/wiki/Rotation_formalisms_in_three_dimensions#Euler_angles_.E2.86.94_Quaternion
function euler2quat(e) {

	if(!e) return;
    
    var roll = .5 * e[0] * to_radians,
        pitch = .5 * e[1] * to_radians,
        yaw = .5 * e[2] * to_radians,

        sr = Math.sin(roll),
        cr = Math.cos(roll),
        sp = Math.sin(pitch),
        cp = Math.cos(pitch),
        sy = Math.sin(yaw),
        cy = Math.cos(yaw),

        qi = sr*cp*cy - cr*sp*sy,
        qj = cr*sp*cy + sr*cp*sy,
        qk = cr*cp*sy - sr*sp*cy,
        qr = cr*cp*cy + sr*sp*sy;

    return [qr, qi, qj, qk];
}

// This functions computes a quaternion multiply
// Geometrically, it means combining two quant rotations
// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/arithmetic/index.htm
function quatMultiply(q1, q2) {
	if(!q1 || !q2) return;

    var a = q1[0],
        b = q1[1],
        c = q1[2],
        d = q1[3],
        e = q2[0],
        f = q2[1],
        g = q2[2],
        h = q2[3];

    return [
     a*e - b*f - c*g - d*h,
     b*e + a*f + c*h - d*g,
     a*g - b*h + c*e + d*f,
     a*h + b*g - c*f + d*e];

}

// This function computes quaternion to euler angles
// https://en.wikipedia.org/wiki/Rotation_formalisms_in_three_dimensions#Euler_angles_.E2.86.94_Quaternion
function quat2euler(t){

	if(!t) return;

	return [ 
		Math.atan2(2 * (t[0] * t[1] + t[2] * t[3]), 1 - 2 * (t[1] * t[1] + t[2] * t[2])) * to_degrees, 
		Math.asin(Math.max(-1, Math.min(1, 2 * (t[0] * t[2] - t[3] * t[1])))) * to_degrees, 
		Math.atan2(2 * (t[0] * t[3] + t[1] * t[2]), 1 - 2 * (t[2] * t[2] + t[3] * t[3])) * to_degrees
	]
}

/*  This function computes the euler angles when given two vectors, and a rotation
	This is really the only math function called with d3 code.

	v0 - starting pos in lon/lat, commonly obtained by projection.invert
	v1 - ending pos in lon/lat, commonly obtained by projection.invert
	o0 - the projection rotation in euler angles at starting pos (v0), commonly obtained by projection.rotate
*/

export function eulerAngles(v0, v1, o0) {

	/*
		The math behind this:
		- first calculate the quaternion rotation between the two vectors, v0 & v1
		- then multiply this rotation onto the original rotation at v0
		- finally convert the resulted quat angle back to euler angles for d3 to rotate
	*/

	var t = quatMultiply( euler2quat(o0), quaternion(geoToCartesian(v0), geoToCartesian(v1) ) );
	return quat2euler(t);	
}
