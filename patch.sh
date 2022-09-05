
kubectl patch deployment liveui-website -p  "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"jenkins-last-build\":\"`date +'%d-%m-%y_%H-%M-%S'`\"}}}}}" -n liveui
