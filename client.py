#!/usr/bin/env python
import requests

host = "http://localhost:8080"
teamid = "ASV"
course = "courseA"

def followleader():
	headers = {}
	r = requests.get("%s/followLeader/%s/%s" % (host, course, teamid))
	print(r.text)

def docking():
	files = {'file': open('rushali.jpeg', 'rb')} 
	r = requests.post("%s/docking/image/%s/%s"%(host,course,teamid), files=files)
	print(r.text)

def heartbeat():#timestamp, challenge, latitude, longitude):
	headers = {"Content-Type": "application/json"}
	data = {"timestamp":"20170306061030","challenge":"gates","position":{"datum":"WGS84","latitude":40.689249,"longitude":-74.044500}}
	r = requests.post("%s/heartbeat/%s/%s" % (host, course, teamid), json=data)
	print(r.text)

def start():
	r = requests.post("%s/run/start/%s/%s" % (host, course, teamid))
	print(r.text)

def end():
	r = requests.post("%s/run/end/%s/%s" % (host, course, teamid))
	print(r.text)

end()

