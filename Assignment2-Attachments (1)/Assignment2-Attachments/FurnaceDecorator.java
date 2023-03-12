package itec3030.assignments.a2;
public abstract class FurnaceDecorator implements OurFurnace {
    protected OurFurnace decoratedFurnace;

    public FurnaceDecorator(OurFurnace decoratedFurnace) {
        this.decoratedFurnace = decoratedFurnace;
    }

    @Override
    public void turnOn() {
        decoratedFurnace.turnOn();
    }
}
