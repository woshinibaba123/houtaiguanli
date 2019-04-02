import store from '@/store'

export default {
	beforeMount() {
		window.addEventListener('resize', this.resizeHandler)
	},
	methods: {
		resizeHandler() {
            var width = document.documentElement.clientWidth;
			if (width < 900) {
				store.dispatch('closeSideBar', {
					withoutAnimation: true
				})
			}
		}
	}
}
