
// Helper function: cross product of two vectors v0&v1
export function cross(v0, v1) {
    return [v0[1] * v1[2] - v0[2] * v1[1], v0[2] * v1[0] - v0[0] * v1[2], v0[0] * v1[1] - v0[1] * v1[0]];
}

//Helper function: dot product of two vectors v0&v1
export function dot(v0, v1) {
    for (var i = 0, sum = 0; v0.length > i; ++i) sum += v0[i] * v1[i];
    return sum;
}