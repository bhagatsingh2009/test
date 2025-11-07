/**
 * Parses user prompts to extract scene parameters
 */
export class PromptParser {
    constructor(prompt) {
        this.prompt = prompt.toLowerCase();
        this.sceneConfig = this.parse();
    }

    /**
     * Parse the prompt and extract scene configuration
     */
    parse() {
        const config = {
            environment: this.detectEnvironment(),
            lighting: this.detectLighting(),
            atmosphere: this.detectAtmosphere(),
            objects: this.detectObjects(),
            colors: this.detectColors(),
            mood: this.detectMood(),
        };

        return config;
    }

    /**
     * Detect environment type from prompt
     */
    detectEnvironment() {
        const environments = {
            forest: ['forest', 'woods', 'trees', 'nature', 'jungle'],
            city: ['city', 'urban', 'street', 'building', 'downtown', 'cyberpunk'],
            space: ['space', 'cosmos', 'galaxy', 'stars', 'planets', 'nebula'],
            ocean: ['ocean', 'sea', 'underwater', 'beach', 'water'],
            desert: ['desert', 'sand', 'dunes', 'arid'],
            mountain: ['mountain', 'peak', 'summit', 'cliff', 'rocks'],
            abstract: ['abstract', 'surreal', 'dreamlike', 'artistic'],
            indoor: ['room', 'indoor', 'interior', 'studio'],
        };

        for (const [env, keywords] of Object.entries(environments)) {
            if (keywords.some(keyword => this.prompt.includes(keyword))) {
                return env;
            }
        }

        return 'abstract'; // default
    }

    /**
     * Detect lighting conditions
     */
    detectLighting() {
        const lighting = {
            bright: ['bright', 'sunny', 'daylight', 'sunlight'],
            dark: ['dark', 'night', 'nighttime', 'evening'],
            neon: ['neon', 'cyberpunk', 'glow', 'fluorescent'],
            warm: ['warm', 'golden', 'sunset', 'sunrise'],
            cool: ['cool', 'blue', 'moonlight', 'cold'],
        };

        for (const [light, keywords] of Object.entries(lighting)) {
            if (keywords.some(keyword => this.prompt.includes(keyword))) {
                return light;
            }
        }

        return 'neutral'; // default
    }

    /**
     * Detect atmospheric effects
     */
    detectAtmosphere() {
        const effects = [];

        if (this.prompt.match(/fog|mist|haze/)) effects.push('fog');
        if (this.prompt.match(/rain|storm|thunder/)) effects.push('rain');
        if (this.prompt.match(/snow|blizzard|winter/)) effects.push('snow');
        if (this.prompt.match(/particle|dust|sparkle/)) effects.push('particles');
        if (this.prompt.match(/glow|light|luminous/)) effects.push('glow');

        return effects;
    }

    /**
     * Detect objects that should be in the scene
     */
    detectObjects() {
        const objects = [];

        // Natural objects
        if (this.prompt.match(/tree|forest/)) objects.push('trees');
        if (this.prompt.match(/rock|stone|boulder/)) objects.push('rocks');
        if (this.prompt.match(/cloud/)) objects.push('clouds');
        if (this.prompt.match(/flower|plant/)) objects.push('plants');

        // Urban objects
        if (this.prompt.match(/building|skyscraper/)) objects.push('buildings');
        if (this.prompt.match(/car|vehicle/)) objects.push('vehicles');

        // Abstract objects
        if (this.prompt.match(/geometric|shape|cube|sphere/)) objects.push('geometric');
        if (this.prompt.match(/crystal|gem/)) objects.push('crystals');

        return objects;
    }

    /**
     * Detect color scheme
     */
    detectColors() {
        const colors = [];

        const colorMap = {
            red: ['red', 'crimson', 'scarlet'],
            blue: ['blue', 'azure', 'cyan'],
            green: ['green', 'emerald', 'forest'],
            purple: ['purple', 'violet', 'magenta'],
            orange: ['orange', 'amber'],
            pink: ['pink', 'rose'],
            yellow: ['yellow', 'gold', 'golden'],
            white: ['white', 'snow'],
            black: ['black', 'dark'],
        };

        for (const [color, keywords] of Object.entries(colorMap)) {
            if (keywords.some(keyword => this.prompt.includes(keyword))) {
                colors.push(color);
            }
        }

        return colors.length > 0 ? colors : ['blue', 'purple']; // default
    }

    /**
     * Detect mood/feeling
     */
    detectMood() {
        const moods = {
            peaceful: ['peaceful', 'calm', 'serene', 'tranquil', 'relaxing'],
            energetic: ['energetic', 'dynamic', 'vibrant', 'exciting'],
            mysterious: ['mysterious', 'enigmatic', 'secret', 'hidden'],
            futuristic: ['futuristic', 'sci-fi', 'cyberpunk', 'technological'],
            fantasy: ['fantasy', 'magical', 'mystical', 'enchanted'],
        };

        for (const [mood, keywords] of Object.entries(moods)) {
            if (keywords.some(keyword => this.prompt.includes(keyword))) {
                return mood;
            }
        }

        return 'neutral';
    }

    /**
     * Get the parsed configuration
     */
    getConfig() {
        return this.sceneConfig;
    }
}
