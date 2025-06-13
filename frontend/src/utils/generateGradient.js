const generateGradient = (userName)=> {
    function hashCode(str) {
        return str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    }

    const hash = hashCode(userName);
    const color1 = `hsl(${hash % 360}, 70%, 60%)`; 
    const color2 = `hsl(${(hash * 1.5) % 360}, 70%, 40%)`;

    return `linear-gradient(135deg, ${color1}, ${color2})`;
}

// Example usage
// const userGradient = generateGradient("YooAzad");
// //console.log(userGradient); // linear-gradient(...)

export default generateGradient
