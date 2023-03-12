package itec3030.assignments.a2;

import java.util.ArrayList;
import java.util.List;

import itec3030.smarthome.standards.ControllerInterface;
import itec3030.smarthome.standards.TemperatureSensor;
import oldtempinc.drivers.OldTempSensor;


public class OldTempSensorAdapter implements TemperatureSensor, OldTempSensorAdaptera {

    private OldTempSensor oldSensorDriver;
    private int currentTemperature;
    private List<TemperatureSensorListener> listeners;

    public OldTempSensorAdapter() {
        OldTempSensor driver = null;
        oldSensorDriver = driver;
        currentTemperature = 0;
        listeners = new ArrayList<>();
    }

    @Override
    public void addTemperatureSensorListener(TemperatureSensorListener listener) {
        listeners.add(listener);
    }

    @Override
    public void removeTemperatureSensorListener(TemperatureSensorListener listener) {
        listeners.remove(listener);
    }

    @Override
    public void pollTemperature() {
        currentTemperature = (int) oldSensorDriver.getTemperature();
        notifyListeners();
    }

    @Override
    public int getTemperature() {
        return currentTemperature;
    }

    private void notifyListeners() {
        for (TemperatureSensorListener listener : listeners) {
            listener.temperatureChanged(this);
        }
    }

    @Override
    public void newTemperature(int i) {

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
    public int getReading() {
        return 0;
    }
}
