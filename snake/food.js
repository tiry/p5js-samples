class Food {

    constructor(Grid, nbItems) {
        this.foodItems=[];
        this.foodSize =Grid.STEPS;
        for (let i = 0; i < nbItems; i++) {
            let f = {
                color : random(255),
                x : Grid.STEPS * random(Grid.X_MAX/Grid.STEPS),
                y : Grid.STEPS * random(Grid.Y_MAX/Grid.STEPS),
                used : false,
                boost: random([1,2,4])
            }
            this.foodItems.push(f);
        }
    }
    
    getItems() {
        return this.foodItems;
    }

    draw() {
        for (let i = 0; i < this.foodItems.length; i++) {
            if (!this.foodItems[i].used) {
                if (this.foodItems[i].boost==1) {
                    fill(color(100,this.foodItems[i].color,100));
                } else if (this.foodItems[i].boost==2)  {
                    fill(color(100,100,this.foodItems[i].color));
                } else {
                    fill(color(this.foodItems[i].color,100,100));
                }
                noStroke();
                rect(this.foodItems[i].x,this.foodItems[i].y,this.foodSize,this.foodSize);
            }
        }
    }
}