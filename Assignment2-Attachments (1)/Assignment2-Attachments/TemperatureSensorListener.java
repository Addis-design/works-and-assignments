package itec3030.assignments.a2;
import itec3030.smarthome.standards.TemperatureSensor;

public interface TemperatureSensorListener {
    void temperatureChanged(TemperatureSensor sensor);
}
