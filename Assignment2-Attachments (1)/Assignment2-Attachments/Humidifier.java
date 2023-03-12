package itec3030.assignments.a2;
public class Humidifier extends FurnaceDecorator {
    public Humidifier(OurFurnace decoratedFurnace) {
        super(decoratedFurnace);
    }

    @Override
    public void turnOn() {
        super.turnOn();
        System.out.println("Humidifier: On");
    }
}
