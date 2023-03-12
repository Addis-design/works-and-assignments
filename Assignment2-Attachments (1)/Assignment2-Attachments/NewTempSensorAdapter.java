package itec3030.assignments.a2;

import itec3030.smarthome.standards.ControllerInterface;
import itec3030.smarthome.standards.SmartThing;
import itec3030.smarthome.standards.TemperatureSensor;
import newtemp.NewTempSensor.NewTempSensorDriver;
import newtemp.NewTempSensor.NewTempSensorDevice;

public class NewTempSensorAdapter extends NewTempSensorDriver implements TemperatureSensor, SmartThing, NewTempSensorAdaptera {
    private NewTempSensorDevice device;
    private int lastTemperature;

    public NewTempSensorAdapter() throws InterruptedException {
        NewTempSensorDriver adapter = new NewTempSensorDriver();
        NewTempSensorDevice device = new NewTempSensorDevice(adapter);
        synchronized (device) {
            device.start();
        }
        this.device = device;
    }

    @Override
    public void newTemperature(int temperature) {
        this.lastTemperature = temperature;
        System.out.println("Sensor (" + this.getID() + ") receiving new temperature: " + temperature);
    }

    @Override
    public int getReading() {
        return this.lastTemperature;
    }

    @Override
    public void start() throws InterruptedException {
        synchronized (device) {
            device.start();
        }
        // do nothing
    }

    @Override
    public void stop() {
        // do nothing
    }

    @Override
    public ControllerInterface getController() {
        return null;
    }

    @Override
    public void setController(ControllerInterface controllerInterface) {

    }

    @Override
    public String getID() {
        return null;
    }

    @Override
    public void setID(String s) {

    }

    @Override
    public void enable() {

    }

    @Override
    public void disable() {

    }

    @Override
    public boolean enabled() {
        return false;
    }

    @Override
    public NewTempSensorDriver getAdatptee() {
        return null;
    }
}
