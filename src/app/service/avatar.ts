export function getInitials (username?: string | null) {
    if (!username) return "??"
    
    return username.slice(0, 2).toUpperCase()
}

export function stringToColor (str: string){
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 35%, 70%)`
}
