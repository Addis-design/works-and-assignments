package itec3030.assignments.a2;

public class WiFiAndHumidifierDecorator extends FurnaceDecorator {
    public WiFiAndHumidifierDecorator(OurFurnace decoratedFurnace) {
        super(decoratedFurnace);
    }

    @Override
    public void turnOn() {
        super.turnOn();
        System.out.println("Wifi: Initialized");
        System.out.println("Humidifier: On");
    }
}
