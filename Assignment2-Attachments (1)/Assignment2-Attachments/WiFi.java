package itec3030.assignments.a2;
public class WiFi extends FurnaceDecorator {
    public WiFi(OurFurnace decoratedFurnace) {
        super(decoratedFurnace);
    }

    @Override
    public void turnOn() {
        super.turnOn();
        System.out.println("Wifi: Initialized");
    }
}
