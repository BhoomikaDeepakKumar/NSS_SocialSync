package com.example.demo.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.example.demo.service.MyAppUserService;

import lombok.AllArgsConstructor;

@Configuration
@AllArgsConstructor
@EnableWebSecurity
public class SecurityConfig {

    private final MyAppUserService appUserService;

    @Bean
    public UserDetailsService userDetailsService() {
        return appUserService;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(appUserService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Publicly accessible
                        .requestMatchers(
                                "/req/**",      // login, signup routes
                                "/css/**",      // static CSS
                                "/js/**",       // static JS
                                "/images/**",   // static images
                                "/signup.html",
                                "/login.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/test",
                                "/api/public/**" // if you want some public APIs
                        ).permitAll()

                        // Role-based access
                        .requestMatchers("/faculty/**").hasRole("FACULTY")
                        .requestMatchers("/core/**").hasRole("CORE")
                        .requestMatchers("/mentor/**").hasRole("MENTOR")
                        .requestMatchers("/volunteer/**").hasRole("VOLUNTEER")

                        // Any other request requires authentication
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/req/login")
                        .defaultSuccessUrl("/index", true) // we can improve this to role-based later
                        .permitAll()
                )
                .logout(logout -> logout.permitAll())
                .build();
    }
}
