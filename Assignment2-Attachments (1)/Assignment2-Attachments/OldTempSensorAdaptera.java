package itec3030.assignments.a2;

public interface OldTempSensorAdaptera {
    void addTemperatureSensorListener(TemperatureSensorListener listener);

    void removeTemperatureSensorListener(TemperatureSensorListener listener);

    void pollTemperature();

    int getTemperature();
}
