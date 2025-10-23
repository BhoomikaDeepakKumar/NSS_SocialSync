@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("superadmin");
            admin.setPassword(passwordEncoder.encode("admin123")); // secure in real app!
            admin.setRole(RoleType.ROLE_ADMIN);
            userRepository.save(admin);
        }
    }
}
