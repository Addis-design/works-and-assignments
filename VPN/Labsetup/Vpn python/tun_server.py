#!/usr/bin/env python3
from scapy.all import *
from scapy.layers.inet import IP, TCP,ICMP
import os

IP_A = "0.0.0.0"
PORT = 9090
tun=os.open('dev/net/tun',os.O_RDWR)
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind((IP_A, PORT))
while True:
    data, (ip, port) = sock.recvfrom(2048)
    print("{}:{} --> {}:{}".format(ip, port, IP_A, PORT))
    pkt = IP(data)
    print(" Inside: {} --> {}".format(pkt.src, pkt.dst))
    os.write(tun,data)