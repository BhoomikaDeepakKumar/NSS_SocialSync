    package com.example.demo.Controller;

    import org.springframework.stereotype.Controller;
    import org.springframework.web.bind.annotation.GetMapping;

    @Controller
    public class ContentController {
        
        @GetMapping("/req/login")
        public String login(){
            return "login";
        }


        
        @GetMapping("/req/signup")
        public String signup(){
            return "signup";
        }
        @GetMapping("/index")
        public String home(){
            return "index";
        }
        
        @GetMapping("/profile")
        public String Profile() {
            return "profile";
        }

        @GetMapping("/complete-profile")
        public String completeProfile() {
            return "complete-profile";
        }

        @GetMapping("/news-feed")
        public String newsFeed() {
            return "news-feed";
        }
        @GetMapping("/add-event")
        public String addEvent() {
            return "add-event";
        }

        @GetMapping("/upcoming-events")
        public String upcomingEvents() {
            return "upcoming-events";
        }

        @GetMapping("/past-events")
        public String pastEvents() {
            return "past-events";
        }

        @GetMapping("/event-details")
        public String eventDetails() {
            return "event-details";
        }

        @GetMapping("/attendance-records")
        public String attendanceRecords() {
            return "attendance-records";
        }

        @GetMapping("/reports")
        public String reports() {
            return "reports";
        }

        @GetMapping("/mark-attendance")
        public String markAttendance() {
            return "mark-attendance";
        }

        @GetMapping("/manage-users")
        public String manageUsers() {
            return "manage-users";
        }

        @GetMapping("/forgot-password")
        public String forgotPassword() {
            return "forgot-password";
        }
        @GetMapping("/password-reset-success")
        public String passwordResetSuccess() {
            return "password-reset-success";
        }
    }
